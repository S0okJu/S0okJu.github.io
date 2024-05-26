---
title: "BOJ 1308 - D-Day"
date: 2024-05-26
slug: boj-1308
categories:
  - Algorithm
tags:
  - BOJ
  - Go
---

## 문제 분석

- 캠프가 끝날 때까지 몇일 남았는지 계산
- 윤년 계산 필요
  - 서력기원 연수가 4로 나누어떨어지는 해는 우선 윤년으로 한다. (2004년, 2008년, …)
  - 100으로 나누어떨어지는 해는 평년으로 한다. (2100년, 2200년, …)
  - 400으로 나누어떨어지는 해는 다시 윤년으로 한다. (1600년, 2000년, …)

### 입력

- 오늘 날짜, D-Day 날자가 주어짐
- D-{일} 로 출력 -> 일 단위로 오늘, D-Day 간의 차이를 구해야 함.
- 1000일이 넘어갈 시 gg 출력
  - 년도 차가 1000 초과
  - 년도 차가 1000인 경우 월, 일 비교할 필요가 있음

### 종합

오늘을 today, D-Day를 dday라고 칭하겠습니다.

1. today, dday을 입력받는다.
2. 값의 차가 1000년이 넘는지 확인한다.
   1. 1000 초과
   2. 년도 차가 1000이면서 today의 날이 dday보다 더 이른경우
3. 일 단위로 전환
   - today의 년도를 기준으로 계산한다.
   - 각 월마다 끝나는 요일이 다르다는 것도 고려해야 한다.
   1. today을 일로 변환시킨다.
      1. today의 년도를 기준으로 계산하므로 월,일 -> 일로 변환시킨다. 예로 2008년 1월 18일이라면, 2008년을 기준으로 계산하기 때문에 1월 18일만 계산하면 된다. 그러므로 31 + 18 = 49가 된다.
   2. dday를 계산한다.
      1. today부터 dday-1 년 차이를 계산하여 일로 변환시킨다.
         1. 윤년이면 366, 평년이면 365를 더한다.
      2. dday의 월, 일을 일로 변환시킨다.
4. today와 dday의 차이를 계산한다.

## 코드

1. today, dday을 입력받는다.

```go
package Silver

import (
    "fmt"
)

// DaysOfMonth : 각 월에 해당되는 일 수를 저장한다.
// 일 수가 고정되어 있으므로 미리 map 타입으로 정의한다.
var DaysOfMonth map[int]int = map[int]int{
    1: 0, 2: 31, 3: 59, 4: 90, 5: 120, 6: 151,
    7: 181, 8: 212, 9: 243, 10: 273, 11: 304, 12: 334,
}

type Date struct {
    Year  int
    Month int
    Day   int
}

// isLeapYear : 윤년인지 확인한다.
func isLeapYear(year int) bool {
    if year%4 == 0 {
       if year%100 == 0 {
          if year%400 == 0 {
             return true
          }
          return false
       }
       return true
    }
    return false
}

// DayCalculator : Date 구조체를 받아서 해당 날짜를 일 단위로 변환시킨다.
// 월, 일을 일 단위로 변환시킨다.
// DaysOfMonth 에서 2월의 경우 평년 28일을 기준으로 정했으며, 추후 윤년인 경우 1일을 더해준다.
func DayCalculator(date Date) int {
    day := DaysOfMonth[date.Month] + date.Day
    if isLeapYear(date.Year) && date.Month > 2 {
       day += 1
    }
    return day
}

func Silver1308() {
    // 1. today, dday을 입력받는다.
    var today, dday Date
    fmt.Scanf("%d %d %d", &today.Year, &today.Month, &today.Day)
    fmt.Scanf("%d %d %d", &dday.Year, &dday.Month, &dday.Day)

    // 2. 값의 차가 1000년이 넘는지 확인한다.
    if dday.Year-today.Year > 1000 || (dday.Year-today.Year == 1000 && (dday.Month > today.Month || (dday.Month == today.Month && dday.Day >= today.Day))) {
       fmt.Println("gg")
       return
    }

    // 3. 일 단위로 전환한다.
    // 3.1. today, dday 년 차이를 일 단위로 전환시킨다.
    daysBetweenYears := 0
    for year := today.Year; year < dday.Year; year++ {
       if isLeapYear(year) {
          daysBetweenYears += 366
       } else {
          daysBetweenYears += 365
       }
    }
    todayDayOfYear := DayCalculator(today)

    // 3.2. dday을 일 단위로 전환시킨다.
    ddayDayOfYear := DayCalculator(dday)

    // 4. today, dday의 차이를 계산한다.
    totalDays := (daysBetweenYears + ddayDayOfYear) - todayDayOfYear
    fmt.Printf("D-%d\n", totalDays)
}
```
