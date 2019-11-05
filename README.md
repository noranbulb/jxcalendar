jxcalendar
-
인풋과 칼렌더를 이용하여 날짜를 입력하는 플러그인.

https://jxcalendar.netlify.com/

#### html

 ``` sh
 <div>시작 : <input type="text" id="from-1" name="from-1" data-to="to-1" data-table="table-8">
                  - 종료 : <input type="text" id="to-1" name="to-1" data-to="from-1" data-table="table-8"> </div>

````

#### javascript

```` sh
<head>
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/jquery-migrate-1.2.1.js"></script>
    <script src="resources/js/jxcalendar-ver-2.js"></script>
</head>

<body>

..기본 인풋 객체 생략..

<script>

      new JXCALENDAR(  $("#from-1") ); //시작 달력
      new JXCALENDAR(  $("#to-1") ); //종료 달력
</script>

</body>

````


### option

Option | Type | Default | Description
------ | ---- | ------- | -----------
dateFormat            |  string  |  'yyyy-mm-dd'  | 년 월 일 표현식
changeYear            |  boolen  |  true  |  년 셀렉트 박스 표현 여부 ( false : 셀렉트 박스 생성 안됨)
changeMonth         |  boolen  |  true  |  월 셀렉트 박스 표현 여부 ( false : 셀렉트 박스 생성 안됨)
yearRange             |  string  |  '1870:2030'  |  년도의 범위를 정할수 있다. 년도가 맨 밑과 맽 위가 설정 범위보다 작다면 100년을 더해주거나 빼준다. `기본은 1870~2030 `
selectYearName      |  string  |  '년'  |  년을 선택하는 셀렉트에 숫자 뒤에 표시를 바꿀수 있다. `year를 쓰면 2019 year으로 표현`
monthNamesShort  |  array  |  ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] |  월 셀렉트 박스에 월 뒤에 표시
headFormatShort    |  array  |  ['월', '화', '수', '목', '금', '토', '일'] |  날짜 바로 상단에 표시 글자 `['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 이렇게 넣으면 영어로 표시`
dayOn                  |  boolen  |  false |  날짜 뒤에 요일 표시  `true 값을 주면 2019-11-05 (화)`
showOn                |  string  |  'button' |  input 옆에 버튼을 생성. `'' 값을 주면 버튼이 생성되지 않는다.`
buttonImage          |  string  |  'resources/imgs/calendar.gif' |  버튼을 이미지로 표현할때 이미지 경로
buttonImageOnly    |  boolen | true |  버튼을 button 태그 사용 안하고 이미지로만 사용
buttonText             |  string | 'Select date' |  버튼 이미지로 사용하는데 buttonImage 옵션에 ''값을 넣어준면 설정된 글자가 보여진다.
numberOfMonths    |  number  | 1 |  달력이 보여지는 갯수
isTo                      |  boolen  | false |  인풋이 하나일때 달력에 시작과 종료를 표시하고 싶을



