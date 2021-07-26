package com.ssafy.closer.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDto {
    private int bookmark_pk;
    private int kind_pk; // 보드 분류 pk
    private int board_pk;
    private String userId;
}
