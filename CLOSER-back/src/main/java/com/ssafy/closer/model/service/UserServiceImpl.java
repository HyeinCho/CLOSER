package com.ssafy.closer.model.service;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.ssafy.closer.model.dto.MemberDto;
import com.ssafy.closer.model.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private SqlSession sqlSession;

    @Override
    public Map<String, String> login(Map<String, String> user) throws SQLException {
        if(user.get("userId") == null || user.get("password") == null)
            return null;
        return sqlSession.getMapper(UserMapper.class).login(user);
    }

    @Override
    public List<MemberDto> userList() {
        return sqlSession.getMapper(UserMapper.class).userList();
    }

    @Override
    public MemberDto userInfo(String userid) {
        return sqlSession.getMapper(UserMapper.class).userInfo(userid);
    }

    @Override
    public int userRegister(MemberDto memberDto) {
        return sqlSession.getMapper(UserMapper.class).userRegister(memberDto);
    }

    @Override
    public int userModify(MemberDto memberDto) {
        return sqlSession.getMapper(UserMapper.class).userModify(memberDto);
    }

    @Override
    public int userDelete(String userid) {
        return sqlSession.getMapper(UserMapper.class).userDelete(userid);
    }

    @Override
    public int userIdCheck(String userId) {
        return sqlSession.getMapper(UserMapper.class).userIdCheck(userId);
    }

    @Override
    public int userNicknameCheck(String nickname) {
        return sqlSession.getMapper(UserMapper.class).userNicknameCheck(nickname);
    }
}
