package com.ssafy.closer.model.service;

import com.ssafy.closer.model.dto.AlarmDto;
import com.ssafy.closer.model.dto.BotDto;

import java.util.List;

public interface AlarmService {
    List<AlarmDto> alarmList(String userId); // 알람들
    int alarmBoardCreate(AlarmDto alarmDto); // 알람 생성 (댓글, 좋아요, 북마크)
    int alarmFollowCreate(AlarmDto alarmDto); // 알람 생성 (팔로우)
    void alarmBotCreateDay(); // 알람 생성 (클로저봇) - 요일
    void alarmBotCreateDate(); // 알람 생성 (클로저봇) - 날짜
    int alarmBotInsert(BotDto botDto); // 알람 일정 생성
    int alarmUnread(String userId); // 읽지 않은 알람 갯수
    int readAll(String userId); // 알림 모두 읽은걸로 바꾸기
}
