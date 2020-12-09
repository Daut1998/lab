$(document).ready(function() {
	setInterval(()=>{time()}, 1000) //Цикл для времени в названии вкладки

	function time() { // функция которая обновляет время в названии вкладки
		let t = new Date()
		let hh = t.getHours()<10?"0"+t.getHours():t.getHours();
		let mm = t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes();
		let ss = t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds();
		$("#time").text(hh+":"+mm+":"+ss)
	}

	$("#start_window").modal('show'); // Показывает стартовое окно

	var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
     	type: 'line',
   	 	data:{
   	 		datasets: [{
			    label: "Coca-Cola",
			    borderColor: "red",
			    fill: false
	  		},
	  		{
			    label: "Fanta",
			    borderColor: "Yellow",
			    fill: false
	  		},
	  		{
			    label: "Sprite",
			    borderColor: "green",
			    fill: false
	  		}]
  		},
    	options: {
    		scales: {
	            xAxes: [{
		            type: 'time',
		            time: {
		                unit: 'second',
		                displayFormats: {
		                    second: 'HH:mm:ss'
		                }
		            },
		            scaleLabel: {
		        		display: true,
		        		labelString: 'Время'
			      	}

		        }],
		        yAxes: [{
		        	scaleLabel: {
		        		display: true,
		        		labelString: 'Количество продаж'
			      	}
		        }]
	        }
    	}
    });

    var table = $(".tab1").DataTable({
	 	"language": {
	 		"zeroRecords": "Записей нет"
	 	},
        "scrollY": "250px",
        "scrollX": true,
        "scrollCollapse": true,
        "paging": false,
        "info": false,
        "sDom": "lrtip", //откл поиск
        "autoWidth": false,
        "columns": [
            { "width": "10%" },
            { "width": "50%" },
            null,
            { "width": "100%" }
        ]
    });

    var log_tb = $(".tab2").DataTable({
	 	"language": {
	 		"zeroRecords": "Записей нет"
	 	},
        "scrollY": "200px",
        "scrollX": true,
        "scrollCollapse": true,
        "paging": false,
        "info": false,
        "sDom": "lrtip", //откл поиск
        "autoWidth": false,
        "columns": [
            { "width": "45px" },
            { "width": "360px" },
            { "width": "202px" }
        ]
    });


    var start = false
    $('#do_on').click(function() {
    	if(!start) {
    		start = true
    		$('#status_work').text("включен").removeClass("text-danger").addClass("text-success")
    		$("#do_on").attr("disabled", true)
    		$("#do_start").removeAttr("disabled")
    		$(".status_auto-col-first span").toggleClass("text-success").text("есть")
    		$("#status_sell").text("0")
    		$("#status_cash").text("0")
    		$(".rub").toggleClass("invisible")
    		$("#status_workY").text("да").toggleClass("text-success")
    	}
    })

    function playAudio(){
      var myAudio = new Audio;
      myAudio.src = "error.wav";
      myAudio.play();
   }

    var start_model = false
    var timer
    var ready = true
    var index = 0
    var C = 0, F = 0, S = 0
    var Cz=20, Fz=20, Sz=20
    var cash = 0
    var cashZ = 0
    var drinks = 100
    var proc
    var power = true
    var index_err = -1;
    var error = [false, false, false, false]
    var again = false

	$("#do_start").click(function() {
		if(!again) {
			$("#auto_fix").modal("show")
			again = true
		} else {
			window.location.reload()
		}
		
	})

    $("#do_run").click(function() {
    	if(start&&!start_model) {
    		$("#auto_fix").modal("hide")
    		start_model = true
    		$("#do_start").attr("disabled", true)
    		$("#do_exit").removeAttr("disabled")
    		$("#status_sell").text("0")
    		$("#status_cash").text("0")
    		$(".status_auto-col-first span").text("есть").removeClass("text-danger").addClass("text-success")
    		$("#status_workY").text("да").removeClass("text-danger").addClass("text-success")
    		$(".manage_block-btn-col button").removeAttr("disabled")
    		$(".manage_block-state button").removeAttr("disabled")
    		table.clear().draw();
    		timer = setInterval(()=>{
    			if(error[0]||error[1]||error[2]||error[3]) {
    				playAudio()
    			}
    			if(ready) {
    				ready = false
					let rnd = Math.floor(Math.random() * (10000 - 3000) + 3000)
		    		proc = setTimeout(()=>{
		    			let rnd_drink = Math.floor(Math.random() * (4 - 1) + 1)
		    			let rnd_err = Math.floor(Math.random() * (90 - 60) + 60)
		    			if(rnd_err==75&&!error[0]) {
		    				if(!$("#autoSolve").is(':checked')) {
		    					playAudio()
		    					error[0] = true
		    					log("Отсутствует питание")
		    					power = false
	    						$("#resolve_power").removeAttr("disabled")
	    						$("#status_network").text("нет").addClass("text-danger").removeClass("text-success")
	    						$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
    						} else {
    							playAudio()
    							log("Питание восстановлено в автоматическом режиме")
    						}
		    			}
		    			if(!power&&!error[1]) {
		    				playAudio()
		    				error[1] = true
		    				$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
		    			}
		    			if(cashZ+60>5000||cashZ==5000&&!error[2]) {
		    				playAudio()
		    				error[2] = true
		    				calcStack()
		    				$("#resolve_stacker").removeAttr("disabled")
		    				$("#status_stack").text("нет").removeClass("text-success").addClass("text-danger")
		    				$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
		    			}
	    				if(Cz+Fz+Sz==0&&!error[3]) {
	    					playAudio()
	    					error[3] = true
	    					calcDrinks()
	    					$("#resolve_drink").removeAttr("disabled")
    						$("#status_drink").text("нет").removeClass("text-success").addClass("text-danger")
    						$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
    					}else if((rnd_drink==1&&Cz==0)||(rnd_drink==2&Fz==0)||(rnd_drink==3&Sz==0)) {
		    				let rnd_drink_new = rnd_drink
		    				while(rnd_drink_new==rnd_drink) {
		    					rnd_drink_new = Math.floor(Math.random() * (4 - 1) + 1)
		    				}
		    				rnd_drink = rnd_drink_new
		    			} if(!error[0]&&!error[1]&&!error[2]&&!error[3]) {
			    			switch(rnd_drink) {
			    				case 1:
			    					newSell("Coca-Cola", 55)
			    					cash+=55
			    					cashZ+=55
			    					C++
			    					Cz--
			    					myChart.data.datasets[0].data.push({x:new Date(), y:C});
	    							myChart.update();
			    				break
			    				case 2:
			    					newSell("Fanta", 50)
			    					cash+=50
			    					cashZ+=50
			    					F++
			    					Fz--
			    					myChart.data.datasets[1].data.push({x:new Date(), y:F});
	    							myChart.update();
			    				break
			    				case 3:
			    					newSell("Sprite", 60)
			    					cash+=60
			    					cashZ+=60
			    					S++
			    					Sz--
			    					myChart.data.datasets[2].data.push({x:new Date(), y:S});
	    							myChart.update();
			    				break
			    			}
			    			$("#status_cash").text(cash)
			    			calcDrinks()
			    			calcStack()
		    			}
		    			ready = true
		    		}, rnd)
    			}
    			
    		}, 500)
    	}
    })

    function log(err) {
    	index_err++
    	let date = new Date()
		let hh = date.getHours()<10?"0"+date.getHours():date.getHours();
		let mm = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
		let ss = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
		log_tb.row.add( [
            index_err,
            err,
            date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()+" "+hh+":"+mm+":"+ss
        ] ).draw(true);
    }

    function newSell(name,price) {
    	if(table.row(':last', { order: 'index' }).data()==undefined) {
			index = 0;
		} else {
			index = table.row(':last', { order: 'index' }).data()[0]+1
		}
		$("#status_sell").text(index+1)
		let date = new Date()
		let hh = date.getHours()<10?"0"+date.getHours():date.getHours();
		let mm = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
		let ss = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
		table.row.add( [
            index,
            name,
            price,
            date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()+" "+hh+":"+mm+":"+ss
        ] ).draw(true);
    }

    $('#do_exit').click(function() {
    	if(start) { 
			start_model = false
			clearInterval(timer)
			clearTimeout(proc)
			ready = true
			C = 0, F = 0, S = 0
			Cz=20, Fz=20, Sz=20
			cash = 0
			cashZ = 0
			drinks = 100
			power = true
    		$(this).attr("disabled", true)
    		$("#do_start").removeAttr("disabled")
    		$(".manage_block-btn-col button").attr("disabled", true)
    		$(".manage_block-btn-col-2 button").attr("disabled", true)
    		$(".manage_block-state button").attr("disabled", true)
    	}
    })

    $("#crash_drink").click(function(){
    	log("Отсутствуют напитки")
    	Cz=0, Fz=0, Sz=0
    	calcDrinks()
    	$("#resolve_drink").removeAttr("disabled")
    	$("#status_drink").text("нет").removeClass("text-success").addClass("text-danger")
    	$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
    })

    $("#resolve_drink").click(function() {
    	error[3] = false
    	Cz=20, Fz=20, Sz=20
    	calcDrinks()
    	$(this).attr("disabled", true)
    	$("#status_drink").text("есть").removeClass("text-danger").addClass("text-success")
    	$("#status_workY").text("да").removeClass("text-danger").addClass("text-success")
    })

    $("#crash_stacker").click(function(){
    	log("Стэкер переполнен")
    	cashZ=5000
    	calcStack()
    	$("#resolve_stacker").removeAttr("disabled")
    	$("#status_stack").text("нет").removeClass("text-success").addClass("text-danger")
    	$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
    })

    $("#resolve_stacker").click(function(){
    	error[2] = false
    	cashZ=0
    	calcStack()
    	$(this).attr("disabled", true)
    	$("#status_stack").text("есть").removeClass("text-danger").addClass("text-success")
    	$("#status_workY").text("да").removeClass("text-danger").addClass("text-success")
    })

    $("#crash_power").click(function(){
    	power = false
    	log("Отсутствует питание")
    	$("#resolve_power").removeAttr("disabled")
    	$("#status_network").text("нет").addClass("text-danger").removeClass("text-success")
    	$("#status_workY").text("нет").removeClass("text-success").addClass("text-danger")
    })

    $("#resolve_power").click(function(){
    	power = true
    	error[1] = false
    	error[0] = false
    	$(this).attr("disabled", true)
    	$("#status_network").text("есть").addClass("text-success").removeClass("text-danger")
    	$("#status_workY").text("да").removeClass("text-danger").addClass("text-success")
    })

    $("#get_state-stack").click(function(){
    	calcStack()
    	$("#info_stack").modal("show")
    })

    $("#get_state-drink").click(function(){
    	calcDrinks()
    	$("#info_drinks").modal("show")
    })

    function calcStack() {
    	let res = (cashZ/5000)*100
    	$("#info_stack_body").html("<p>Заполненность стэкера, %: "+res.toFixed(2)+"</p>")	
    }

    function calcDrinks() {
    	let CFS = Cz+Fz+Sz
    	let res = (CFS/60)*100
    	$("#info_drinks_body").html("<p>Запас напитков, %: "+res.toFixed(2)+"</p>")	
    }


})