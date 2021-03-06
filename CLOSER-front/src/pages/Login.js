import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginAction } from '../modules/user'
// import { getMyInfoAction, loginAction, getPostCount } from '../modules/user'
import { RippleButton, ShakeButton } from '../styles/index';
import '../styles/theme.css'
import swal from 'sweetalert';

function Login({ history }) {
  // Redux store 접근 시 사용
  const dispatch = useDispatch();
  
  const [userInputs, setUserInputs] = useState({
    userId: '',
    password: ''
  });
  
  const { userId, password } = userInputs;

  // const { decodedToken, isLoggedIn } = useSelector((state) => state.user);

  const onChange=useCallback(
    e => {
      const { name, value } = e.target;
      // console.log(name, value);
      setUserInputs({
        ...userInputs,
        [name]: value
      });
    },
    [userInputs]
  );

  // 데이터 빈 값 검사
  const checkExistData = (value, name) => {
    if (value === '') {
      setTimeout( function () {
        // alert(name + " 입력해주세요!")
        swal(name + " 입력해주세요!", "", "info");
      }, 350);
      return false;
    }
    return true;
  }

  // 아이디 검사
  const checkUserId = (id) => {
    if (!checkExistData(id, "아이디를")) {
      return false
    }
    // var idRegExp = /^[a-zA-z0-9]{4,12}$/; //아이디 유효성 검사
    // if (!idRegExp.test(id)) {
    //     alert("아이디는 영문 대소문자와 숫자 4~12자리로 입력해야합니다!");
    //     form.userId.value = "";
    //     form.userId.focus();
    //     return false;
    // }
    return true
  }

  // 비밀번호 검사
  const checkPassword = (password) => {
    if (!checkExistData(password, "비밀번호를")) {
      return false
    }
    return true
    // var password1RegExp = /^[a-zA-z0-9]{4,12}$/; //비밀번호 유효성 검사
    // if (!password1RegExp.test(password1)) {
    //     alert("비밀번호는 영문 대소문자와 숫자 4~12자리로 입력해야합니다!");
    //     form.password1.value = "";
    //     form.password1.focus();
    //     return false;
  }

  // 모든 검사
  function checkAll() {
    if (!checkUserId(userId)) {
      return false;
    } else if (!checkPassword(password)) {
      return false;
    }
    return true;
  }

    
  // 제출 시 검사 함수 실행 후 로그인 함수 실행
  const onSubmit=(
    e => {
      setTimeout( function() {
        // 검사 함수로 확인,
        if (checkAll() === true) {
        // 로그인 요청
        axios.post('http://localhost:8080/user/login', userInputs )
          .then((res) => {
            const jwtAuthToken = res.headers["jwt-auth-token"]
            if(res.status === 200){
              dispatch(loginAction({ jwtAuthToken }));
              history.push('/')
            } else{
              // alert('존재하지 않는 회원정보입니다!')
              swal('존재하지 않는 회원정보입니다!', "", "info");
            }
          })
          .catch((err) => {
            console.log(err)
          })
        }
      }, 350);
      e.preventDefault();

    }
  )
  
  // App.js로 이전함
  // 로그인에 성공했으면 로그인 유저 정보, 게시글 수 가져오기
  // useEffect(() => {
  //   if (isLoggedIn === true && decodedToken.user_id !== null){
  //     axios.post(`http://localhost:8080/user/profileinfo?userId=${decodedToken.user_id}`)
  //       .then((res) => {
  //         dispatch(getMyInfoAction(res.data))
  //         axios.get(`http://localhost:8080/user/totalBoard/${decodedToken.user_id}`)
  //           .then((res) => {
  //             dispatch(getPostCount(res.data))
  //             history.push('/')
  //           })
  //           .catch((err) => {
  //             console.log(err)
  //           })
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })
  //     }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [decodedToken])


  // 회원가입 페이지로 이동
  const goSignup = () => {
    setTimeout( function () {
      history.push('/signup')
    }, 350);
  }
  

  return (
    <div className="wrap-group"> 
      <h2 className="phrase">클로저에서 자취<br></br>200퍼센트 즐기기</h2>
      <form onSubmit={onSubmit} className="type-group">
      <div className="label-group">
        <span className="input-label">아이디</span>
        <span className="necessary unfollow">*</span>
      </div>
      <input
        placeholder="아이디를 입력하세요"
        onFocus={(e) => {
          e.target.placeholder='';
        }}
        onBlur={(e) => {
          e.target.placeholder='아이디를 입력하세요';
        }}
        type="text"
        name="userId"
        value={userId}
        onChange={onChange}
      />
      <div className="label-group">
        <span className="input-label">비밀번호</span>
        <span className="necessary unfollow">*</span>
      </div>
      <input
        placeholder="비밀번호를 입력하세요"
        onFocus={(e) => {
          e.target.placeholder='';
        }}
        onBlur={(e) => {
          e.target.placeholder='비밀번호를 입력하세요';
        }}
        type="password"
        name="password"
        value={password}
        onChange={onChange}
      />
      <div className="button-group">
        { userId === '' || password === ''
          ? <ShakeButton cclass="cbtn cbtn-lg cbtn-secondary" children="로그인"/>
          : <RippleButton type="submit" cclass="cbtn cbtn-lg cbtn-primary" children="로그인"/>
        } 
        <RippleButton type="button" cclass="cbtn cbtn-none cbtn-lg" children="회원가입" onClick={goSignup}/>
      </div>
      </form>
    </div>
  )
}

export default Login;