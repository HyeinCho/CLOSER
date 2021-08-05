import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { followAction, getFollowInfoAction } from '../../modules/user';
import { Row, Col } from 'react-bootstrap';

// import UserFeed from '../components/profile/UserFeed';
// import UserPost from '../components/profile/UserPost';
// import UserBookmark from '../components/profile/UserBookmark';

function OtherProfile({ id }) {

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState([])
  const [isFollowed, setIsFollowed] = useState(false)

  const { userId } = useSelector((state) => state.user.userInfo)
  const { following } = useSelector((state) => state.user)

  // 타인의 정보 가져오기
  useEffect(() => {
    axios.post(`http://localhost:8080/user/profileinfo?userId=${id}`)
    .then((res) => {
      setUserInfo(res.data)
    })
    .catch((err) => {
      console.log(err)
    })

    // 내가 팔로우하고 있는 사람인지 여부 가져오기
    axios.post(`http://localhost:8080/follow/${id}/follow`, {
      userId: userId,
      flag: 'false',
    })
    .then((res) => {
      setIsFollowed(res.data.followed)
      dispatch(getFollowInfoAction())
    })
    .catch((err) => {
      console.log(err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [following])

  // 팔로우 / 팔로우 취소 버튼 클릭 시
  const onClickFollow = () => {
    axios.post(`http://localhost:8080/follow/${id}/follow`, {
      userId: userId,
      flag: 'true',
    })
    .then((res) => {
      console.log(res)
      dispatch(followAction())
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="container">
      {/* Row-1 : 뒤로가기 */}
      <Row>

      </Row>
      {/* Row-2 : 프로필사진, 닉네임, 자취기간, 위치, 프로필 수정 */}
      <Row>
        <Col xs={3}>
          <img src="" alt="프로필 사진"></img>
        </Col>
        <Col xs={6}>
          <Row>
            <Col>
              {userInfo.nickname}
            </Col>
            <Col>
              자취 {userInfo.homeAlone}년차
            </Col>
          </Row>
          <Row>
            {userInfo.addr}
          </Row>
        </Col>
        <Col xs={3}>
          {isFollowed ? <button onClick={onClickFollow}>팔로우 취소</button>
            : <button onClick={onClickFollow}>팔로우</button>
          }
        </Col>
      </Row>
      {/* Row-3 : 뱃지 */}
      <Row>
        뱃지 컴포넌트, 라우터
      </Row>
      {/* Row-4 : 한줄소개 */}
      <Row>
        {userInfo.addr}
      </Row>
      {/* Row-5 : 팔로잉, 팔로워, 공유하기 */}
      <Row>
        <Col xs={3}>
          <Link to={`/${userInfo.userId}/following-list`}>팔로잉</Link>
        </Col>
        <Col xs={3}>
          <Link to={`/${userInfo.userId}/follower-list`}>팔로워</Link>
        </Col>
        <Col xs={{ span: 3, offset: 3 }}>
          공유하기 버튼
        </Col>
      </Row>
      {/* Row-6 : 내피드, 내포스트, 북마크 */}
      <Row>
        <Col>
          내피드 컴포넌트
        </Col>
        <Col>
          내포스트 컴포넌트
        </Col>
        <Col>
          북마크 컴포넌트
        </Col>
      </Row>
      
      
    </div>
  );
}

OtherProfile.propTypes = {
  id: PropTypes.string,
}

export default OtherProfile;