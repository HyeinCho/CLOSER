import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { followAction, getFollowInfoAction } from '../../modules/user';
import UserBadge from './UserBadge';
import { changeOtherNavbar } from '../../modules/user';
import { RippleButton, RippleTabItem, RippleIcon } from '../../styles/index';
import defaultProfile from '../../assets/user-on.svg';
import compassRegular from '../../assets/profile/compass-regular.svg';
import calendarRegular from '../../assets/profile/calendar-alt-regular.svg';
import '../../styles/tab.css'
import '../../styles/theme.css'
import './MyProfile.css';
import dmImg from '../../../src/assets/message-write.svg';

/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */

function OtherProfile({ id, history }) {

  const dispatch = useDispatch();

  const now = new Date()

  const [userInfo, setUserInfo] = useState([])
  const [isFollowed, setIsFollowed] = useState(false)

  const { userId } = useSelector((state) => state.user.userInfo)
  const { following, yourNavbar } = useSelector((state) => state.user)


  useEffect(() => {
    // 타인의 정보 가져오기
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
      dispatch(followAction())
    })
    .catch((err) => {
      console.log(err)
    })
  }

  // 이미지 없을 시 기본 이미지 생성
  const handleImgError = (e) => {
    e.target.src = defaultProfile;
  }

  // 프로필 공유 로직
  const textInput = useRef();

  const copyLink = () => {
    const el = textInput.current
    el.select()
    document.execCommand('copy')
  }

  const children = [
    ['피드', '포스트', '북마크'],
    [
      `/profile/${userInfo.userId}/user-feed`,
      `/profile/${userInfo.userId}/user-board`,
      `/profile/${userInfo.userId}/user-bookmark`
    ],
    [
      '/user-feed',
      '/user-board',
      '/user-bookmark',
    ]
  ]

  const onClickTap = ( e ) => {
    history.replace(e.target.getAttribute('addr'))

    if(e.target.getAttribute('addr') === children[1][0]) {
      dispatch(changeOtherNavbar(children[2][0]))
    } else if(e.target.getAttribute('addr') === children[1][1]) {
      dispatch(changeOtherNavbar(children[2][1]))
    } else if(e.target.getAttribute('addr') === children[1][2]) {
      dispatch(changeOtherNavbar(children[2][2]))
    }
  }

  // 1:1 채팅창으로 이동
  const OtherChat = () =>{
    setTimeout( function() {
      history.push(`/Omessages/${userInfo.userId}`)
    }, 350);
  }

  return (
    <> 
      <div className="page-semi-wrapper">
      <Redirect to={`/profile/${id}${yourNavbar}`} />
      {/* 1. 프로필 사진, 뱃지와 수정 버튼 */}
        <div className="d-flex row justify-content-start align-items-end mx-0">
          <div className="row align-items-end">
            {/* 프로필사진 */}
            <div className="col-3 px-0 d-flex justify-content-center">
              <div className="profile-img-wrapper">
                <img src={userInfo.profileImg}  alt="userprofile" className="profile-img" onError={handleImgError}/>
              </div>
            </div>
            {/* 뱃지 */}
            <div className="col-4 px-0"><UserBadge wrapclass="px-1" cclass="profile-badge" userId={id} /></div>

            {/* 팔로우, 언팔로우, DM보내기 버튼  */}
            <div className="col-5 px-0 d-flex justify-content-around align-items-center">
              {/* DM 아이콘 */}
              <div className="col-4">
                <RippleIcon src={dmImg} alt="dmImage" id="dmImage" cclass="message-button p-4 m-0" onClick={OtherChat} />
              </div>
              {/* 팔로우 언팔로우 */}
              <div className="col-7 row justify-content-end">
                {isFollowed
                    ?
                    <RippleButton onClick={onClickFollow} cclass="cbtn m-0 cbtn-sm cbtn-secondary">언팔로우</RippleButton>
                    :
                    <RippleButton onClick={onClickFollow} cclass="cbtn m-0 cbtn-sm cbtn-primary">팔로우</RippleButton>
                }
              </div>
            </div>
          </div>

          {/* 2. 닉네임 */}
          <h2 className="row justify-content-start px-3 pt-3 pb-1">
            <div className="col px-0 text-start">{userInfo.nickname}</div>
          </h2>

          {/* 3. 아이디, 소개말 */}
          <p className="input-placeholder-style row justify-content-start px-3">
            @{userInfo.userId}
          </p>
          <p className="row justify-content-start px-3 pt-3">{userInfo.intro}</p>
          {/* 4. 위치, 자취년차 */}
          <div className="row light-font justify-content-start px-3 pt-3">
            <span className="p-0">
              <img src={compassRegular} alt="addr-icon" className="profile-icon ps-0 pe-2"/>
                <span>{userInfo.addr}</span>
              <img src={calendarRegular} alt="homeAlone-icon" className="profile-icon ps-4 pe-1"/>
              {userInfo.homeAlone === 0
                ? <span> 자취희망러 </span> 
                : <span> 자취 {now.getFullYear()-userInfo.homeAlone+1} 년차 </span>}
            </span>
          </div>

          <div className="row px-3 pt-3 bm-profile-info justify-content-between">
            <div className="row px-3 col-6 p-0">
              <div className="col-6 p-0">
                  <Link to={`/following-list/${userInfo.userId}`} className="link-dark">
                    {userInfo.following} 팔로잉
                  </Link>
              </div>
              <div className="col-6 p-0">
                <Link to={`/follower-list/${userInfo.userId}`} className="link-dark">
                  <div>{userInfo.follower} 팔로워</div>
                </Link>
              </div>
            </div>

            <div className="col-4 ps-0 pe-1 d-flex justify-content-end profile-share">
              <input type="text" value={window.location.href} ref={textInput} readOnly  className="profile-share-link"/>
              <RippleButton cclass="cbtn me-0 my-0 cbtn-sm cbtn-light" children="프로필 공유" onClick={copyLink}/>
            </div>
          </div>
        </div>

      </div>
      <div className="tabs-wrapper">
        <nav className="tabs">
          <RippleTabItem cclass={ yourNavbar === children[2][0]? "tab is-current" : "tab"} children={children[0][0]} onClick={onClickTap} addr={children[1][0]} />
          <RippleTabItem cclass={ yourNavbar === children[2][1]? "tab is-current" : "tab"} children={children[0][1]} onClick={onClickTap} addr={children[1][1]} />
          <RippleTabItem cclass={ yourNavbar === children[2][2]? "tab is-current" : "tab"} children={children[0][2]} onClick={onClickTap} addr={children[1][2]} />
          <div className="nav-underline"></div> 
        </nav>
      </div>
    </>
  );
}

OtherProfile.propTypes = {
  id: PropTypes.string,
}

export default withRouter(OtherProfile);