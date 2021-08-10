package com.ssafy.closer.controller;

import com.ssafy.closer.model.dto.MemberDto;
import com.ssafy.closer.model.service.JwtService;
import com.ssafy.closer.model.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/user")
@Api("User Controller API V1")
@CrossOrigin("*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @ApiOperation(value = "로그인 화면으로 이동")
    @GetMapping("/login")
    public ModelAndView login() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("user/login");
        return mav;
    }

    @ApiOperation(value = "로그인.", response = MemberDto.class)
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Map<String, String> loginInfo,
                                                     HttpServletResponse response) {
        logger.debug("login 정보 - " + loginInfo);
        try {
            Map<String, String> user = userService.login(loginInfo);

            // 로그인에 성공했다면 토큰을 만듭시당.
            if (user != null) {
                logger.debug(user.toString());
                String token = jwtService.create(user.get("userId")); // 토큰에 유저 아이디만 넣는다.
                user.put("token", token);

                // 토큰 정보는 response의 헤더로 보내자
                response.setHeader("jwt-auth-token", token);
                return new ResponseEntity(SUCCESS, HttpStatus.OK);
            } else {
                logger.debug("login fail");
                return new ResponseEntity(HttpStatus.NO_CONTENT);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "회원가입", response = String.class)
    @PostMapping("/regist")
    public ResponseEntity<String> register(@RequestBody MemberDto memberDto) {
        try {
            logger.debug("회원가입 : " + memberDto);
            int n = userService.userRegister(memberDto);

            if (n > 0) {
                return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
            } else {
                return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "아이디 중복 확인", notes = "사용자의 아이디 중복 확인")
    @PostMapping("/userIdCheck")
    public ResponseEntity<String> userIdCheck(@RequestParam String userId) {
        logger.debug("중복 확인 요청된 아이디 : " + userId);

        int result = userService.userIdCheck(userId);

        if(result == 0){
            return ResponseEntity.ok("사용 가능한 아이디입니다.");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용중인 아이디입니다.");
    }

    @ApiOperation(value = "닉네임 중복확인", notes = "사용자의 닉네임 중복확인")
    @PostMapping("/userNicknameCheck")
    public ResponseEntity<String> userNicknameCheck(@RequestParam String nickname) {
        logger.debug("중복 확인 요청된 닉네임 : " + nickname);

        int result = userService.userNicknameCheck(nickname);

        if(result == 0){
            return ResponseEntity.ok("사용 가능한 닉네임입니다.");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용중인 닉네임입니다.");
    }

    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        logger.debug("로그아웃");
        return new ResponseEntity<String>("ok", HttpStatus.OK);
    }


    @ApiOperation(value = "개인정보 수정", response = MemberDto.class)
    @PutMapping(value = "/mypage")
    public ResponseEntity<String> modify(@RequestBody MemberDto updateInfo) {
        logger.debug("수정정보 : " + updateInfo);

        try {
            int n = userService.userModify(updateInfo);
            if (n > 0) {
                return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
            } else {
                return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "회원 탈퇴", response = MemberDto.class)
    @DeleteMapping("/")
    public ResponseEntity<String> delete(@RequestParam String userid) {
        logger.debug("회원 탈퇴 : 아이디 " + userid);
        try {
            int n = userService.userDelete(userid);
            if (n > 0) {
                return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
            } else {
                return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "프로필 페이지 정보 (내 프로필, 다른사람 프로필 모두 사용)")
    @PostMapping("/profileinfo")
    public ResponseEntity profileInfo(@RequestParam String userId){
        logger.debug("조회할 프로필 페이지 id : " + userId);

        try{
            MemberDto memberDto = userService.userInfo(userId);
            List<Integer> badge = userService.userbadge(userId);
            memberDto.setBadge(badge);

            if(memberDto!=null){
                return new ResponseEntity(memberDto,HttpStatus.OK);
            }else{
                logger.debug("profile info fail");
                return new ResponseEntity(HttpStatus.NO_CONTENT);
            }
        }catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "프로필 페이지 포스트")
    @GetMapping("/board/{userId}")
    public ResponseEntity profilePost(@PathVariable String userId) {
        return new ResponseEntity(userService.userPost(userId),HttpStatus.OK);
    }

    @ApiOperation(value = "프로필 페이지 피드")
    @GetMapping("/feed/{userId}")
    public ResponseEntity profileFeed(@PathVariable String userId) {
        return new ResponseEntity(userService.userFeed(userId),HttpStatus.OK);
    }

    @ApiOperation(value = "프로필 페이지 북마크")
    @GetMapping("/bookmark/{userId}")
    public ResponseEntity profileBookmark(@PathVariable String userId) {
        return new ResponseEntity(userService.userBookmark(userId),HttpStatus.OK);
    }

//    @RequestMapping(value = "이메일 인증")
//    public ModelAndView pw_auth(HttpSession session, HttpServletRequest request, HttpServletResponse response) throws IOException {
//        String email = (String) request.getParameter("email");
//        String name = (String) request.getParameter("name");
//
//        MemberVO vo = memberSV.selectMember(email);
//
//        if (vo != null) {
//            Random r = new Random();
//            int num = r.nextInt(999999); // 랜덤난수설정
//
//            if (vo.getName().equals(name)) {
//                session.setAttribute("email", vo.getEmail());
//
//                String setfrom = "ivedot@naver.com"; // naver
//                String tomail = email; //받는사람
//                String title = "인증 이메일입니다.";
//                String content = System.getProperty("line.separator") + "안녕하세요 회원님" + System.getProperty("line.separator")
//                        + "이메일 인증번호는 " + num + " 입니다." + System.getProperty("line.separator"); //
//
//                try {
//                    MimeMessage message = mailSender.createMimeMessage();
//                    MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "utf-8");
//
//                    messageHelper.setFrom(setfrom);
//                    messageHelper.setTo(tomail);
//                    messageHelper.setSubject(title);
//                    messageHelper.setText(content);
//
//                    mailSender.send(message);
//                } catch (Exception e) {
//                    System.out.println(e.getMessage());
//                }
//
//                ModelAndView mv = new ModelAndView();
//                mv.setViewName("YM/pw_auth");
//                mv.addObject("num", num);
//                return mv;
//            } else {
//                ModelAndView mv = new ModelAndView();
//                mv.setViewName("YM/pw_find");
//                return mv;
//            }
//        } else {
//            ModelAndView mv = new ModelAndView();
//            mv.setViewName("YM/pw_find");
//            return mv;
//        }
//    }
}