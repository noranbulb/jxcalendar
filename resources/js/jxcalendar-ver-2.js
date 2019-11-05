/*
//------------------ JXCALENDAR  ------------------ //
설명 : 가로로 움직이는게 한칸씩이 아닌 드래그 한만큼 움직이게 하고 싶을때 사용하는 플러그인

version( 버전 ) : 2
date ( 날짜 ) : 2019.11.01

[ option ]
dateFormat: 년 월 일 표현식
changeYear: true // false면 바로 년도를 선택하는 모양이 없어짐
changeMonth: true // false면 바로 월을 선택하는 모양이 없어짐
yearRange: '1870:2030' //년도의 범위를 정할수 있다. 년도가 맨 밑과 맽 위가 설정 범위보다 작다면 100년을 더해주거나 빼준다.
selectYearName: '년' //년을 선택하는 셀렉트에 숫자 뒤에 표시를 바꿀수 있다. year를 쓰면 2019 year
monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] // 월 셀렉트 박스에 월 뒤에 표시
headFormatShort: ['월', '화', '수', '목', '금', '토', '일'] //날짜 바로 상단에 표시
dayOn: false //날짜 뒤에 요일 표시
showOn: "button" //input 옆에 버튼을 생성. '' 값을 주면 버튼이 생성되지 않는다.
buttonImage: "resources/imgs/calendar.gif" //버튼을 이미지로 표현할때 이미지 경로
buttonImageOnly: true //버튼을 button 태그 사용 안하고 이미지로만 사용
buttonText: "Select date" //버튼 이미지로 사용하는데 buttonImage에 경로가 틀리거나 ''값을 넣어준면 글자가 보여진다.
numberOfMonths: 1 //달력이 보여지는 갯수
isTo : false //두개의 인풋이 연결이 되게 하는것
*/

function JXCALENDAR(obj, option) {
    var _this = this;

    this.default = {
        dateFormat: 'yyyy-mm-dd'
        , changeYear: true // false면 바로 오늘 년도가 뿌려짐
        , changeMonth: true // false면 바로 오늘 월이 뿌려짐
        , yearRange: '1870:2030'
        , selectYearName: '년'
        , monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        , headFormatShort: ['월', '화', '수', '목', '금', '토', '일']
        , dayOn: false
        , showOn: 'button' //input 옆에 버튼을 생성할것인가. 주석처리 하면 나타나지 않음
        , buttonImage: 'resources/imgs/calendar.gif'
        , buttonImageOnly: true //이미지로만 표현 false 면 이미지와 버튼으로 표현
        , buttonText: 'Select date'
        , numberOfMonths: 1
        , isTo : false //두개의 인풋이 연결이 되게 하는것
    }



    this.option = $.extend ( {} , this.default , option );

    //객체 변수
    this.input = obj; //인풋
    this.input_id = this.input.attr('id'); //인풋 아이디
    this.input_table = this.input.data('table'); //인풋 테이블

    if ( $('.jx-calendar').size() == 0 ) {
        /*jxcalendar 하나를 가지고 표현하기 때문애 공통 변수를 선한 한번만 한다.*/

        $('body').append( '<div class="jx-calendar"></div>' );
        $('.jx-calendar').bFocuseChk = false; //인풋 포커스
        $('.jx-calendar')[0].selectDateArr = []; //선택한 날짜를 담는것
        $('.jx-calendar')[0].saveDateArr = [];
        $('.jx-calendar')[0].sortDateArr = [];
    }

    $('.jx-calendar').off('mouseenter mouseleave');
    $('.jx-calendar').on('mouseenter' , function(e) {
        $('.jx-calendar')[0].bFocuseChk = true;
    }).on('mouseleave' , function(e) {
        $('.jx-calendar')[0].bFocuseChk = false;
    });

    //버튼 이미지가 있을경우
    if ( this.option.showOn != '' && this.option.showOn.toLowerCase() == 'button' ) {

        this.bttonInit();
        this.input.on('focusout' , function(e) {
            //console.log('btn focusout ' , $('.jx-calendar')[0].bFocuseChk)
            if ( !$('.jx-calendar')[0].bFocuseChk ) {
                $('.jx-calendar').removeClass('on')//.css({'display':'none'});
                _this.timeSet( $('.jx-calendar').hasClass('on') );
            }
        });
    } else {
        this.input.on('focusin' , function(e) {
            //console.log('in ' , _this.bFocuseChk , $('.jx-calendar')[0].bFocuseChk)
            if( !$('.jx-calendar')[0].bFocuseChk ) {
                _this.calendarPosition();
                _this.timeSet( _this.jxcalendar.hasClass('on') );
                _this.jxcalendar.data({'id' : _this.input_id }); //jxcalendar를 공통으로 사용하기 때문에 data-id로 input id 값을 넣줘서 어떤 input에 해당하는지를 구분해야함
            }

        }).on('focusout', function(e) {
            //console.log('focusout ' , $('.jx-calendar')[0].bFocuseChk)
            if ( !$('.jx-calendar')[0].bFocuseChk ) {
                $('.jx-calendar').removeClass('on');
                _this.timeSet( $('.jx-calendar').hasClass('on') );
            }
        });
    }
}//JXCALENDAR


JXCALENDAR.prototype.bttonInit = function() {
    //input 박스 옆에 버튼을 생성하는 과정
    var _this = this;
    var img = new Image();

    img.onload = function(e) { }
    img.onerror = function(e) {
        //console.log('onerror  ', _this.option.buttonImageOnly )
        /*
        이미지 경로가 잘못되었을때인데
        이미지로만 할것이면 이미지가 없기 때문에 이미지를 삭제하고 버튼안에 글자를 넣고
        버튼으로 표현할것이면 버튼 안에 글자만 넣는다.
        */

        if (  _this.option.buttonImageOnly ) {
           // console.log('1 . 버튼에 이미지를 표현해야하는데 이미지 경로가 틀리면 이미지가 없어서 버튼을 만들고 글자를 넣고')
            _this.input.next().remove();
            $('<button type="button" class="jxcalendar-trigger-button" id="trigger-button-'+  _this.input_id  +'">' + _this.option.buttonText + '</button>').insertAfter( _this.input );
            $( '#trigger-button-'+  _this.input_id  +'' ).off('click');
            $( '#trigger-button-'+  _this.input_id  +'' ).on("click" , function(e) {
                if( !$('.jx-calendar')[0].bFocuseChk ) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this.calendarPosition();
                    _this.timeSet( _this.jxcalendar.hasClass('on') );
                    _this.jxcalendar.data({'id' : _this.input_id }); //jxcalendar를 공통으로 사용하기 때문에 data-id로 input id 값을 넣줘서 어떤 input에 해당하는지를 구분해야함
                    $('#'+$('.jx-calendar').data('id')).focus();
                }
            }) ;
        } else {
            //console.log('2. 버튼에 이미지를 표현해야하는데 이미지 경로가 틀리지만 버튼이 이미지 만들어져 있어서 글자만 넣는다.')
            _this.input.parent().find('button').text( _this.option.buttonText );
        }
    }


    if (  _this.option.buttonImageOnly ) {
        $( '<img src="' + _this.option.buttonImage + '" class="jxcalendar-trigger-button" id="trigger-button-'+_this.input_id+'">  ' ).insertAfter( _this.input );
        img.src = _this.input.parent().find('img').attr('src');
    } else {
        $('<button type="button" class="jxcalendar-trigger-button" id="trigger-button-'+  _this.input_id  +'"><img src="' + _this.option.buttonImage + '"></button>').insertAfter( _this.input )
        img.src = _this.input.parent().find('button img').attr('src');
    }

    $( '#trigger-button-'+  _this.input_id  +'' ).off('click');
    $( '#trigger-button-'+  _this.input_id  +'' ).on("click" , function(e) {
        //console.log('triger')
        if( !$('.jx-calendar')[0].bFocuseChk ) {
            e.stopPropagation();
            e.preventDefault();
            _this.calendarPosition();
            _this.timeSet( _this.jxcalendar.hasClass('on') );
            _this.jxcalendar.data({'id' : _this.input_id }); //jxcalendar를 공통으로 사용하기 때문에 data-id로 input id 값을 넣줘서 어떤 input에 해당하는지를 구분해야함
            $('#'+$('.jx-calendar').data('id')).focus();
        }
    }) ;

}//bttonInit

JXCALENDAR.prototype.calendarPosition = function() {
    var _this = this;
    //console.log("calendarPosition 달력 부모를 생성하고 위치 잡기 ")
    _this.jxcalendar = $('.jx-calendar'); //클릭했때 계속 담는다. 공통 다이브 이기때문에
    _this.jxcalendar.css({'left':  $('#'+_this.input_id).offset().left  ,'top': $('#'+_this.input_id).offset().top + $('#'+_this.input_id).outerHeight() }); //위치잡고

    //달력을 보여주는것
    if(  _this.jxcalendar.data('id') ==  _this.input_id ) {
        //토글
        _this.jxcalendar.toggleClass('on');
    } else {
        //다르면
        _this.jxcalendar.addClass('on');
    }
}//calendarPosition


JXCALENDAR.prototype.timeSet = function( b ) {
    var _this = this;

    if ( b ) {

        this.jxcalendar.empty(); //달력 내용을 지워준고
        this.now = new Date(); //요일 색깔 해줄때 사용

        /*var table;// = this.jxcalendar[0].saveDateArr[_this.input.data('table')];
        if ( _this.input.data('table') != undefined ) {
            table = this.jxcalendar[0].saveDateArr[_this.input.data('table')];
        } else {
            table = _this.jxcalendar[0].selectDateArr[_this.input_id];
        }*/

        //var table = this.jxcalendar[0].saveDateArr[_this.input.data('table')];
        //console.log(_this.input.data('table') )

        if ( _this.input.data('to') != undefined ) {

            if ( _this.input.data('table') == undefined ) {
                alert('경고: 시작과 종료 날짜에 data-table 설정이 없거나 설정을 한다면 같은 값으로 넣으세요.');
                return;
            }

            var table = this.jxcalendar[0].saveDateArr[_this.input.data('table')];
            //console.log('table ' , table ,  _this.input.data('table'))

            if ( _this.input_id.indexOf('from') != -1 &&  _this.input.data('to').indexOf('to') == -1 ) {
                alert('경고: 시작 날짜에 data-to=to 값이 들어간걸로 설정을 안했다면 isTo 옵션을 false 값을 주세요');
                return;
            }
            if ( _this.input_id.indexOf('to') != -1 &&  _this.input.data('to').indexOf('from') == -1 ) {
                alert('경고: 종료 날짜에 data-to=from 값이 들어간걸로 설정을 안했다면 isTo 옵션을 false 값을 주세요');
                return;
            }
            for(var i=0; i < this.option.numberOfMonths ; i++ ) {
                if( table != undefined ) {
                    //console.log('a1 . toggle ' , table[0] , table[1])
                    if ( _this.input_id.indexOf('from') != -1 && table[0] != undefined ) {
                        //왼쪽 인풋  날짜 설정
                        this.time = new Date( table[0][0] , table[0][1] + i , 1);
                    } else if ( _this.input_id.indexOf('to') != -1 && table[1] != undefined ) {
                        //오른쪽 인풋 날짜 설정
                        if ( this.option.numberOfMonths > 1 ) {
                            this.time = new Date( table[1][0] , table[1][1] + i - (this.option.numberOfMonths-1) , 1);
                        } else {
                            this.time = new Date( table[1][0] , table[1][1] + i , 1);
                        }
                    } else {
                        this.time = new Date( this.now.getFullYear() , this.now.getMonth() + i , 1);
                    }
                } else {
                    //console.log('a2 . toggle ')
                    this.time = new Date( this.now.getFullYear() , this.now.getMonth() + i , 1);
                }
                _this.createHead(i);
            }
        } else {

            //data-to가 없다면
            if ( _this.option.isTo ) {

                if ( _this.input.data('table') == undefined ) {
                    alert('경고: 시작과 종료 날짜에 data-table 설정이 없거나 설정을 한다면 같은 값으로 넣으세요.');
                    return;
                }

                var table = this.jxcalendar[0].saveDateArr[_this.input.data('table')];
                //console.log('time 설정 isTo = true ' , table  )
                for(var i=0; i < this.option.numberOfMonths ; i++ ) {
                    if( table != undefined ) {
                        this.time = new Date( table[0][0] , table[0][1] + i , 1);
                    } else {
                        this.time = new Date( this.now.getFullYear() , this.now.getMonth() + i , 1);
                    }
                    _this.createHead(i);
                }
            } else {
                var table = _this.jxcalendar[0].selectDateArr[_this.input_id];
                //console.log('time 설정 isTo = false ' ,this.jxcalendar[0].saveDateArr[_this.input.data('table')] , this.jxcalendar[0].saveDateArr[_this.input_id] , _this.jxcalendar[0].selectDateArr[_this.input_id]  )
                for(var i=0; i < this.option.numberOfMonths ; i++ ) {
                    if( table != undefined ) {
                        this.time = new Date( _this.jxcalendar[0].selectDateArr[_this.input_id][0] , _this.jxcalendar[0].selectDateArr[_this.input_id][1] + i , 1);
                    } else {
                        this.time = new Date( this.now.getFullYear() , this.now.getMonth() + i , 1);
                    }
                    _this.createHead(i);
                }
            }
        }
    }
}//timeSet


JXCALENDAR.prototype.addEvent = function(idx) {

    var _this = this;
    this.createWeek( _this.time.getFullYear() , _this.time.getMonth() , idx ); //날짜를 생성
    this.addLREvent(); // 좌우 버튼 클릭 이벤트 등록
    this.addTDEvent(); // 날짜 클릭 이벤트 등록

    if ( _this.option.changeYear ) {
        _this.addSelectYearEvent(); //년도 셀렉트 박스 이벤트 등록
    }

    if ( _this.option.changeMonth ) {
        _this.addSelectMonthEvent();  //월 셀렉트 박스 이벤트 등록
    }
}//JXCALENDAR.prototype.addEvent

JXCALENDAR.prototype.addLREvent = function() {
    //console.log('addLREvent 좌우 버튼 이벤트 ')
    var _this = this;
    this.jxcalendar.find('>.jx-wrap > .jx-control > .jxbtns').off('click');
    this.jxcalendar.find('>.jx-wrap > .jx-control > .jxleft').on('click' , function(e) {

        //console.log('달력 왼쪽 버튼 클릭')
        if( _this.option.numberOfMonths != 1 ){
            for(var i=0; i < _this.option.numberOfMonths ; i++ ) {
                if( i == 0 ) {
                    _this.time.setMonth ( _this.time.getMonth() - ( _this.option.numberOfMonths-i ), 1 );
                } else {
                    _this.time.setMonth ( _this.time.getMonth() + 1, 1 );
                }
                _this.addEvent(i);
            }
        } else {
            _this.time.setMonth( _this.time.getMonth()-1, 1 );
            _this.addEvent(0);
        }
        $('#'+$('.jx-calendar').data('id')).focus();
    });

    this.jxcalendar.find('>.jx-wrap > .jx-control .jxright').on('click' , function(e) {
        if( _this.option.numberOfMonths != 1 ){
            for(var i=0; i < _this.option.numberOfMonths ; i++ ) {
                _this.time.setMonth ( _this.time.getMonth()+i , 1 );
                _this.addEvent(i);
            }
        } else {
            _this.time.setMonth ( _this.time.getMonth()+1 , 1 );
            _this.addEvent(0);
        }

        //$('.jx-calendar')[0].bFocuseChk = true;
        //$('.jx-calendar').data({"bFocuseChk":true});
        $("#"+$('.jx-calendar').data("id")).focus();
    });
}//addLREvent

JXCALENDAR.prototype.addTDEvent = function() {
    //console.log('addTDEvent 생성된 날짜 이벤트 ')
    var _this = this;

    this.jxcalendar.find('>.jx-wrap .jx-week .jx-table td').off('click');
    this.jxcalendar.find('>.jx-wrap .jx-week .jx-table .jxtd').on('click' , function(e) {

        var a = $(this).find("a");
        //본인 선택한 날짜를 담는다.

        var year, month;
        if ( $(this).closest('.jx-wrap').find('.jx-year select').length >= 1 ) {
            year = $(this).closest('.jx-wrap').find('.jx-year select').val();
        } else {
            year = $(this).closest('.jx-wrap').find('.jx-year').text().split('').filter(function(i) {
                        if ( i.charCodeAt(0) < 65 ) {
                            return i;
                        }
                        }).join('');
        }

        if ( $(this).closest('.jx-wrap').find('.jx-month select').length >= 1 ) {
            month = $(this).closest('.jx-wrap').find('.jx-month select').val();
        } else {
            month = $(this).closest('.jx-wrap').find('.jx-month').text().split('').filter(function(i) {
                        if ( i.charCodeAt(0) < 65 ) {
                            return i;
                        }
                        }).join('');
        }

        //var selectDate = _this.jxcalendar[0].selectDateArr[_this.input_id] = [$(this).closest('.jx-wrap').find('.jx-year select').val(),$(this).closest('.jx-wrap').find('.jx-month select').val()-1, parseFloat( a.text() )]; //본인의 날짜 기록
        var selectDate = _this.jxcalendar[0].selectDateArr[_this.input_id] = [year, month-1, parseFloat( a.text() )]; //본인의 날짜 기록
        var selectDateFormat = ''; //결과값을 this.option.dataFormat : 'yy-mm-dd' 에 맞춰서 담는 변수

        //console.log('click  ' , _this.input.data('table') , _this.jxcalendar[0].saveDateArr[_this.input.data('table')])

        //console.log('-- ', _this.option.isTo , _this.input.data('to') == undefined , _this.jxcalendar[0].saveDateArr[_this.input.data('table')] != undefined )
        if ( _this.option.isTo && _this.input.data('to') == undefined && _this.jxcalendar[0].saveDateArr[_this.input.data('table')] != undefined ) {
            if ( _this.jxcalendar[0].saveDateArr[_this.input.data('table')].length > 1) {
                _this.jxcalendar[0].sortDateArr = [];
            }
        }


        if( _this.jxcalendar[0].saveDateArr[_this.input.data('table')] == undefined && _this.input.data('table') != undefined ) {
            //console.log('다른 인풋 클릭햇을때 담아있던 배열값 초기화') ** 중료
            _this.jxcalendar[0].sortDateArr = [];
        }

        var table = _this.jxcalendar[0].saveDateArr[_this.input.data('table')]; //선택한 날짜를 담은 배열을 또 다시 고유 테이블로 담는 변수

        if ( _this.input.data('to') != undefined  ) {
            //input 이 두개일때
            if ( _this.input.data('to').indexOf('to') != -1) {
                if( table != undefined && table[1] != undefined ) {
                    var sy = selectDate[0], sm = selectDate[1], sd = selectDate[2]
                       , ey = table[1][0], em = table[1][1], ed = table[1][2]
                       , stime = new Date(sy,sm,sd)
                       , etime = new Date(ey,em,ed);

                    if( stime > etime ) {
                        alert('시작 날짜는 종료 날짜보다 적은날을 선택 하세요 ')
                        return;
                    }

                    if( stime.getTime() == etime.getTime() ) {
                        alert('시작 날짜와 종료 날짜가 다른 날을 선택하세요.');
                        return;
                    }


                }
                _this.jxcalendar[0].sortDateArr[0] = selectDate;//배열의 1번째에 날짜 저장
            }

            if ( _this.input.data('to').indexOf('from') != -1) {
                if( table != undefined && table[0] != undefined ) {
                    var sy = table[0][0], sm = table[0][1], sd = table[0][2]
                       , ey = selectDate[0], em = selectDate[1], ed = selectDate[2]
                       , stime = new Date(sy,sm,sd)
                       , etime = new Date(ey,em,ed);

                    if( stime > etime ) {
                        alert('종료 날짜는 시작 날짜보다 큰날을 선택 하세요 ')
                        return;
                    }

                    if( stime.getTime() == etime.getTime() ) {
                        alert('시작 날짜와 종료 날짜가 다른 날을 선택하세요.');
                        return;
                    }
                }
                _this.jxcalendar[0].sortDateArr[1] = selectDate; //배열의 2번째에 날짜 저장
            }

            _this.jxcalendar[0].saveDateArr[_this.input.data('table')] = _this.jxcalendar[0].sortDateArr;

            _this.timeSet( $('.jx-calendar').removeClass("on") ); //이게 닫히게 하는 것
            $('.jx-calendar')[0].bFocuseChk = false; //중요

            if( _this.option.showOn != "" && _this.option.showOn.toLowerCase() == "button" ) {
                $("#"+$('.jx-calendar').data("id")).focus();
            }

            if ( _this.option.dayOn ) {
                selectDateFormat = _this.dataFormat( selectDate ) + ' (' +_this.getYoil( selectDate ) +')';
            } else {
                selectDateFormat = _this.dataFormat( selectDate );
            }
            //selectDateFormat = _this.dataFormat( selectDate ); //결과 값을 형식에 맞춰 변화

        } else {
            //input 이 하나일때
            if ( _this.option.isTo ) {
                //인풋 시작과 끝 표현
                if ( _this.jxcalendar[0].sortDateArr[0] != undefined ) {
                    var at = new Date( _this.jxcalendar[0].sortDateArr[0][0] , _this.jxcalendar[0].sortDateArr[0][1] , _this.jxcalendar[0].sortDateArr[0][2] ); //첫번째 날짜
                    var bt = new Date( selectDate[0] , selectDate[1] , selectDate[2] ); //두번째 날짜
                    if ( at.getTime() ==  bt.getTime() ) {
                        alert('시작 날짜와 종료 날짜가 다른 날을 선택하세요.');
                        return;
                    }
                }

                //isTo는 input 하나일때 달력을 시작과 끝을 클릭해야 닫히게 한다.
                if ( _this.jxcalendar[0].sortDateArr.length < 2  ) {
                    _this.jxcalendar[0].sortDateArr.push( selectDate ); //본인의 날짜 기록
                    _this.jxcalendar[0].saveDateArr[_this.input.data('table')] = _this.jxcalendar[0].sortDateArr;
                }

                //console.log('table ' ,table )
                //날짜를 시간에 맞춰서 작은 날짜부터 큰 날짜로 재정렬한다.
                if (table != undefined ) {

                    table.sort(function(n,c) {
                        var ntime = new Date(n[0], n[1] , n[2]);
                        var ctime = new Date(c[0], c[1] , c[2]);
                        return (ntime < ctime) ? -1 : 1;
                    });

                    var at = new Date( table[0][0] , table[0][1] , table[0][2] ); //첫번째 날짜
                    var bt = new Date( table[1][0] , table[1][1] , table[1][2] ); //두번째 날짜
                    var ct = new Date( selectDate[0] , selectDate[1] , selectDate[2] );

                    var r1 = Math.abs(at - ct); //첫번째 담겨있던 값과 현재 클릭한 날짜의 차이비교
                    var r2 = Math.abs(bt - ct); //두번째 담겨있던 값과 현재 클릭한 날짜의 차이비교

                    //현재 선택 날짜와 차이값중 어떤게 더 작은지를 비교해서 선택한 날짜를 배열에 다시 넣는다.
                    if( r1 < r2 ) {
                        //console.log('첫번째에 가깝다 ' , a , a.text() )
                        //a.addClass('jxc--start');
                        table[0] = selectDate;
                    } else if( r1 >= r2 ) {
                        //console.log('두번째에 가깝다 ' ,  a , a.text() )
                        //a.addClass('jxc--end');
                        table[1] = selectDate;
                    }
                }

                if ( _this.jxcalendar[0].saveDateArr[_this.input.data('table')].length == 1 ) {
                    if ( _this.option.dayOn ) {
                        selectDateFormat = _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0]) + ' (' + _this.getYoil( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] ) + ')' ;
                    } else {
                        selectDateFormat = _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0]);
                    }

                    _this.jxcalendar.find('.jxdate').removeClass('jxc--start jxc--end jxc--sel jxc--non');
                    a.addClass('jxc--start');
                    //console.log('한개만 날짜를 선택했다면 ' ,  _this.getYoil( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] )  )
                } else {
                    //console.log('두개 모두 날짜를 선택했다면 날짜사이에 ~ 를 표시 ' , yoilTime1.getDay() , yoilTime2.getDay() );
                    if ( _this.option.dayOn ) {
                        selectDateFormat = _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] ) + ' (' + _this.getYoil( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] ) + ') - ' + _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][1] ) + ' (' + _this.getYoil( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][1] ) + ')' ;
                    } else {
                        selectDateFormat = _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] ) + ' ~ ' + _this.dataFormat( _this.jxcalendar[0].saveDateArr[_this.input.data('table')][1] );
                    }

                    //if ( _this.input.val().indexOf('-') != 4 ) {
                        //console.log('--')
                        _this.timeSet( $('.jx-calendar').removeClass("on") ); //이게 닫히게 하는 것
                        $('.jx-calendar')[0].bFocuseChk = false; //중요
                    //}
                }

                //console.log('클릭 ' , _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0] )

                if ( _this.option.showOn != '' || _this.option.showOn == 'button') {
                    $("#"+$('.jx-calendar').data("id")).focus();
                }

            } else {
                //input 하나고 isTo가 false일때

                if ( _this.option.dayOn ) {
                    selectDateFormat = _this.dataFormat( selectDate ) + ' (' +_this.getYoil( selectDate ) +')';
                } else {
                    selectDateFormat = _this.dataFormat( selectDate );
                }
                _this.timeSet( $('.jx-calendar').removeClass("on") ); //이게 닫히게 하는 것
                $('.jx-calendar')[0].bFocuseChk = false; //중요
            }
        }
        $("#"+_this.input_id).val(  selectDateFormat  ); //값을 뿌려주고
    });
}//addTDEvent

JXCALENDAR.prototype.getYoil = function(time) {

    var year = time[0];
    var month = time[1];
    var date = time[2];
    var time = new Date(year, month, date);
    //console.log('getyoil ' , time.getDay() , (time.getDay()+6)%7 , this.option.headFormatShort[(time.getDay()+6)%7] )
    return this.option.headFormatShort[(time.getDay()+6)%7];
}//getYoil


JXCALENDAR.prototype.addSelectYearEvent = function() {
    var _this = this;

    //console.log('addSelectMonthEvent 생성된 년 셀렉트 이벤트 달아줌 ')
    this.jxcalendar.find('>.jx-wrap > .jx-control .jx-year select').off('change');
    this.jxcalendar.find('>.jx-wrap > .jx-control .jx-year select').on('change' , function(e) {
        //console.log('jxyear' , $(this).val() , _this.time.getMonth() )
        for(var i=0; i < _this.option.numberOfMonths ; i++ ) {
            _this.time.setFullYear( $(this).val()  , _this.time.getMonth()+i , 1);
            _this.addEvent(i);
        }
    });
}//addSelectYearEvent

JXCALENDAR.prototype.addSelectMonthEvent = function() {
    var _this = this;
    //console.log('addSelectMonthEvent 생성된 달 셀렉트 이벤트 달아줌 ')
    this.jxcalendar.find('>.jx-wrap > .jx-control .jx-month select').off('change');
    this.jxcalendar.find('>.jx-wrap > .jx-control .jx-month select').on('change' , function(e) {

        for(var i=0; i < _this.option.numberOfMonths ; i++ ) {
            _this.time.setMonth( $(this).val()-1+i , 1);
            _this.addEvent(i);
        }
    });
}//addSelectMonthEvent


JXCALENDAR.prototype.createHead = function(idx) {
    var _this = this;
    //console.log('createHead 캘린더 상단 표현' , idx , _this.option.numberOfMonths  )
    var jxleft = '', jxright = '';
    if( _this.option.numberOfMonths  > 1 ){
        if( idx == 0 ) {
            jxleft = '<a class="jxbtns jxleft"> < </a>';
            jxright = '';
        }
        if ( idx == _this.option.numberOfMonths-1 ) {
            jxleft = '';
            jxright = '<a class="jxbtns jxright"> > </a>';
        }
    } else {
        jxleft = '<a class="jxbtns jxleft"> < </a>';
        jxright = '<a class="jxbtns jxright"> > </a>';
    }

    var sStructure = '<div class="jx-wrap jx-wrap-'+ _this.input_id +'"><div class="jx-control">' +
                            '<div class="jx-year"></div>' +
                            '<div class="jx-month"></div>' +
                            jxleft+
                            jxright+

                            '</div><div class="jx-week">' +
                                '<table class="jx-table">' +
                                    '<thead class="jx-thead">'+
                                            '<tr><th><span title="일요일">'+this.option.headFormatShort[6]+'</span></th>' +
                                            '<th><span title="월요일">'+this.option.headFormatShort[0]+'</span></th>' +
                                            '<th><span title="화요일">'+this.option.headFormatShort[1]+'</span></th>' +
                                            '<th><span title="수요일">'+this.option.headFormatShort[2]+'</span></th>' +
                                            '<th><span title="목요일">'+this.option.headFormatShort[3]+'</span></th>' +
                                            '<th><span title="금요일">'+this.option.headFormatShort[4]+'</span></th>' +
                                            '<th><span title="토요일">'+this.option.headFormatShort[5]+'</span></th></tr></thead>' +
                                    '<tbody class="jx-tbody"></tbody></table></div></div>';

    this.jxcalendar.append( sStructure ); //기본 코드 붙이고

    _this.addEvent(idx);
}//createHead


JXCALENDAR.prototype.createWeek = function( year , month , idx ) {

    //실제 날짜들을 생성
    var _this = this;
    this.jxwrap = this.jxcalendar.find('.jx-wrap').eq(idx);
    this.jxweek     = this.jxwrap.find('.jx-week');
    this.jxtbody    = this.jxweek.find('.jx-table .jx-tbody');
    this.jxyear      = this.jxwrap.find('.jx-control .jx-year');
    this.jxmonth   = this.jxwrap.find('.jx-control .jx-month');

    this.jxtbody.empty();

    var temp = new Date( year , month , 1);

    //상단에 년을 뿌려주기
    if( !this.option.changeYear ) {
        this.jxyear.text( year+_this.option.selectYearName );
    } else {
        var yearSplit = _this.option.yearRange.split(":");
        var range// = _this.option.yearRange.split(":");


        this.jxyear.empty();
        this.jxyear.append( "<select></select>" );

        // 최상 년도 ~ 최하 년도로 재배열  시킴
        /*for( var i = 0; i < range.length-1; i++ ) {
            //console.log( i );
            for( var j = i + 1 ; j < range.length ; j++ ) {
                //console.log('---' , range[i] )
                if( range[i] < range[j] ) {
                    sort = range[i];
                    range[i] = range[j];
                    range[j] = sort;
                }
               // console.log('===' , _this.yArr[i] )
            }
        }*/
        range = yearSplit.sort( (a,b) => {
            //console.log(a,b)
            return a > b ? -1 : 1;
        } );

        var addyear = 100;

        //기본 옵션값과 외부에서 설정한 최상 년도가  현재 년도보다 작을경우 기본적으로 100년을 더해주자
        if ( parseFloat( range[0] ) <= year ) {
            range[0] = ''+(year+addyear)+'';
        }

        //기본 옵션값과 외부에서 설정한 최하 년도가  현재 년도보다 클경우 기본적으로 100년을 빼준다
        if ( parseFloat( range[1] ) >= year ) {
            range[1] = ''+(year-addyear)+'';
        }

        //위에선 구한 최하와 최상만큼 돌려서 select 박스에 option을 뿌려준다.
        for(var i = range[0] ; i >= range[range.length-1] ; i--) {
            var option;
            if( year == i ) {
                option = '<option value="'+i+'" selected="true">'+i+_this.option.selectYearName+'</option>';
            } else {
                option = '<option value="'+i+'">'+i+_this.option.selectYearName+'</option>';
            }
            this.jxyear.find('select').append (option);
        }
    }

    //상단에 월을 뿌려주기
    if( !this.option.changeMonth ) {
        this.jxmonth.text( month+1+'월' );
    } else {
        //console.log(  this.option.monthNamesShort   )
        this.jxmonth.empty();
        this.jxmonth.append( '<select></select>' );

        var monthNames = this.option.monthNamesShort;
        for (var i in monthNames) {
            //console.log(  i , monthNames[i] )
            var option;
            var n = parseFloat( i );
            if( month == n ) {
                option = '<option value="'+(n+1)+'" selected="true">'+monthNames[i]+'</option>';
            } else {
                option = '<option value="'+(n+1)+'">'+monthNames[i]+'</option>';
            }
            this.jxmonth.find('select').append (option);
        }
    }
    //아래 날짜를 뿌려주기
    var nTr = 0;

    this.jxtbody.append( $('<tr>')  ) // 첫 줄은 무조건 tr를  붙이고

    var startTable, endTable, startYear, startMonth, startDate, endYear, endMonth, endDate , startTime, endTime;
    var table = _this.jxcalendar[0].saveDateArr[_this.input.data('table')];

    for(var i=1 ; i < 32 ; i++) {
        temp.setDate(i);
        //var $tr = $("<tr>");
        //var $td = $("<td><a class='jxdate'></a></td>");
        if( temp.getMonth() == month ) {
            //console.log(temp.getFullYear() == _this.now.getFullYear() , temp.getMonth == _this.now.getMonth() , temp.getDate() == _this.now.getDate() )
            /* 요일이 i 가 1이고  , temp.getDay() 가 0 이면 일요일 */
            if ( temp.getDay() == 0  && temp.getDate() != 1 ) {
                this.jxtbody.append( $('<tr>') ) //한주가 지나면 tr추가
                nTr++; //tr을 생성
            }

            if ( i == 1 && temp.getDay() != 0 ) {
                //1일이고 요일이 일요일아니면 처음 칸부터 해당 요일까지 빈칸을 추가
                for(var j = 1 ; j <= temp.getDay() ; j++ ) {
                    var $td = $('<td></td>');
                    this.jxtbody.find('tr').append( $td );
                }
            }

            //실제 td 생성
            if ( _this.jxcalendar[0].saveDateArr[_this.input.data('table')] !=undefined ) {
                //배열 사용
                startTable = _this.jxcalendar[0].saveDateArr[_this.input.data('table')][0]; //왼쪽 날짜
                endTable = _this.jxcalendar[0].saveDateArr[_this.input.data('table')][1]; //우측 날짜

                if ( startTable != undefined ) {
                    startYear = startTable[0];
                    startMonth = startTable[1];
                    startDate = startTable[2];
                    startTime = new Date(startYear , startMonth, startDate);
                }
                if ( endTable != undefined ) {
                    endYear = endTable[0];
                    endMonth = endTable[1];
                    endDate = endTable[2];
                    endTime = new Date(endYear , endMonth, endDate);
                }
                //여기선 getTime을 사용하면 안된다. undefined 가 있기 때문

                if ( temp - startTime < 0 ) {
                    //console.log(i, ' temp - startTime <0 ')
                    this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--non">'+ i +'</a></td>'  );
                } else if (temp - startTime > 0 ) {

                    if ( temp - endTime > 0 ) {
                        //console.log(i ," temp - startTime > 0 , temp - endTime > 0 ")
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--non">'+ i +'</a></td>'  );
                    } else if ( temp - endTime == 0 ) {
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--sel jxc--end">'+ i +'</a></td>'  );
                    } else {
                        //console.log(i, " temp - startTime > 0 , temp - endTime < 0 ")
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate">'+ i +'</a></td>'  );
                    }
                } else if (temp - startTime == 0) {
                    //console.log(i ," temp - startTime == 0")
                    this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--sel jxc--start">'+ i +'</a></td>'  );
                } else {

                    //console.log(i ," 나머지 ")
                    if ( temp - endTime > 0  ) {
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--non">'+ i +'</a></td>'  );
                    }
                    else {
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate">'+ i +'</a></td>'  );
                    }
                }
            } else {
                //배열 사용 안하고

                startTable = _this.jxcalendar[0].selectDateArr[_this.input_id];

                if ( startTable != undefined ) {
                    //console.log('startTable ' , _this.time.getMonth() )

                    startYear = startTable[0];
                    startMonth = startTable[1];
                    startDate = startTable[2];
                    startTime = new Date(startYear , startMonth, startDate);

                    if( temp.getTime() == startTime.getTime() ) {
                        //console.log('11 sss ' , startMonth , startDate)
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate jxc--sel">'+ i +'</a></td>'  );
                    } else {
                        //console.log("22 sss " , startMonth , startDate)
                        this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate">'+ i +'</a></td>'  );
                    }
                } else {
                    this.jxtbody.find('tr').eq(nTr).append( '<td class="jxtd"><a class="jxdate">'+ i +'</a></td>'  );
                }
            }

            //토, 일 , 오늘 표시
            if ( temp.getFullYear() == _this.now.getFullYear() && temp.getMonth() == _this.now.getMonth() && temp.getDate() == _this.now.getDate() ) {
                //오늘
                this.jxtbody.find('tr').eq(nTr).find('td').eq(temp.getDay()).find('a').addClass('jxc--today');
            } else {
                //공휴일
                if ( temp.getDay() == 0 ) {
                    // 일요일은
                    this.jxtbody.find('tr').eq(nTr).find('td').eq(temp.getDay()).find('a').addClass('jxc--sun');
                }
                if ( temp.getDay() == 6 ) {
                    //토요일은
                    this.jxtbody.find('tr').eq(nTr).find('td').eq(temp.getDay()).find('a').addClass('jxc--sat');
                }
            }
        }
    }
    //console.log('createWeek ' ,  temp.getMonth() )
}//createWeek

JXCALENDAR.prototype.dataFormat = function(value) {
    var _this = this;
    var sDateVal = ''; //결과 값을 넘겨주는것;
    var dateSplit = _this.option.dateFormat.toLowerCase().split('');
    var copy = [] , dateFormatArr = [];

    //옵션에 든 값을 가지고 배열형태로 다시 담고
    var dateStr = '';

    for(var i in dateSplit) {
        copy.push( dateSplit[i] );
        dateStr += dateSplit[i];
        //현재 배열 값과 다음 배열값이 같지 않으면 값을 넣고 초기화
        if ( copy[copy.length-1] != dateSplit[ parseFloat( i ) +1 ] ) {
            //console.log(i , '같지 않다' ,  dateSplit )
            dateFormatArr.push(dateStr);
            dateStr = "";
        }
    }

    for(var i in dateFormatArr) {

        var word = dateFormatArr[i].toLowerCase();
        var code = word.charCodeAt(0);

        if ( ( code >= 65 && code <= 90 ) ||  ( code >= 97 && code <= 122 ) ) {
            if ( word.indexOf('y') != -1) {
                //console.log('년 무조건 2자리 표현 ');
                if ( word.length <= 2 ) {
                    //console.log('년 10일이하는 표현 ');
                    //sDateVal += value[0].toString().substr(2);
                    sDateVal += value[0].substr(2);
                } else {
                    //console.log('년 10일이상는 표현 ');
                    sDateVal += value[0];
                }
            } else if ( word.indexOf('m') != -1) {
                if ( word.length > 1 ) {
                    //console.log('월 2자리 무조건 표현 ')
                    if ( value[1]+1 < 10 ) {
                        //console.log('월 10일 이하는 2자리 표현 ')
                        sDateVal += ('0'+(value[1]+1)) ;
                    } else {
                        //console.log('월 10일 이상는 2자리 표현 ')
                        sDateVal += (value[1]+1);                    }
                } else {
                    //console.log('옵션 m 하나면 10일 이하는 그냥 그대로');
                    sDateVal += (value[1]+1);
                }
            } else if ( word.indexOf('d') != -1) {
                if ( word.length > 1 ) {
                    //console.log('일 2자리 무조건 표현 ')
                    if ( value[2] < 10 ) {
                        //console.log('일 10 이전에는 앞에 0을 붙여줌');
                        sDateVal += ('0'+value[2]) ;
                    } else {
                        //console.log('일 10 이후는 그냥');
                        sDateVal += value[2] ;
                    }
                } else {
                    //console.log('옵션 d 하나면 10일 이하는 그냥 그대로');
                    sDateVal += value[2] ;
                }
            }
        } else if ( code > 200 ) {
            //console.log(i , '한글 ' , word)
            sDateVal += word ;
        } else if ( ( code >= 33 && code <= 47 ) ||  ( code >= 58 && code <= 64 ) ||  ( code >= 91 && code <= 96 ) ||  ( code >= 123 && code <= 125 ) ) {
            //console.log(i , '특수 ' , word)
            sDateVal += word ;
        } else if ( code == 32 ) {
            //console.log(i , '간격 ' , word)
            sDateVal += word ;
        }
    }
    return sDateVal;
}//JXCALENDAR.prototype.dataFormat