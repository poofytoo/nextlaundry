$(document).ready(function(){
  var db;
  
  var disabledBoxes = [];
  var democracy = true;
  
	// set up initial box
	for (i = 1; i <= 10; i ++){
		html = "<ul></ul>" + 
			   //"<a id='more' href='#'>more...</a>" + 
			   "<input id='i" + i + "'type='text' maxlength='50' placeholder='suggest a name' />";
		$("#box" + i).html(html)
	}

	// set up list values
	var data = new Firebase('https://poofytoo.firebaseio.com/basketeer/');
  /*
  data.child('mode').on('value', function(snapshot) {
    if (snapshot.val() == 'democracy') {
      console.log('switching to demo');


      // FORCE DEMOCRACY UPON THE PEOPLE

      democracy = true;
      $('.box').addClass('democracy');
      $('.box2').addClass('democracy');
      $('.box').removeClass('anarchy');
      $('.box2').removeClass('anarchy');
      updateGrid()
      /*
    } else {
      console.log('switching to anar');
      democracy = false;
      $('.box').addClass('anarchy');
      $('.box2').addClass('anarchy');
      $('.box').removeClass('democracy');
      $('.box2').removeClass('democracy');
      updateGrid()
    }
      */
  // })

/*

// AGAIN, FORCING DEMOCRACY!!!!! 

  $('button').on('click', function() {
    var ar = $(this).attr('class');
    data.child('avsdcounter').once('value', function(snapshot) {
      console.log(ar)
      data.child('avsdcounter').child(ar).set(snapshot.val()[ar]+1)
    })
    t = Math.floor(Math.random()*1.99)*180;
    $('.avsd').css('-webkit-transform', 'rotate('+t+'deg)');
    $('.avsd').css('transform', 'rotate('+t+'deg)');
  })

  data.child('avsdcounter').on('value', function(snapshot) {
    a = snapshot.val().anarchy;
    d = snapshot.val().democracy;
    $('.avsd-bar-fill').css('width', 500 * (a) / (a + d));
    if ((a) / (a + d) > 0.75) {
      data.child('mode').once('value', function(snapshot) {
            console.log(snapshot.val(), 'asdf');
        if (snapshot.val() == 'democracy') {
            data.child('avsdcounter').child('democracy').set(10);
            data.child('avsdcounter').child('anarchy').set(30);
      data.child('mode').set('anarchy')
      updateGrid()
        }
      })
      
    }
    if ((a) / (a + d) < 0.25) {
      data.child('mode').once('value', function(snapshot) {
            console.log(snapshot.val(), 'asdf');
        if (snapshot.val() == 'anarchy') {
            data.child('avsdcounter').child('democracy').set(30);
            data.child('avsdcounter').child('anarchy').set(10);
      data.child('mode').set('democracy')
      updateGrid()
        }
      }) 
    }
  })
*/

	var updateGrid = function() {
  	data.once('value', function(snapshot) {
  		db = snapshot.val();
  		// static list values
      /*
  		if (db.mode == 'democracy') {
      */

    		for(i = 1; i <= 10; i ++){
    			html = '';
          if (db["box" + i]) {
      			topVoted = getTopVoted(db["box" + i]);
      			html += "<li title='" + topVoted + "' id='" + i + "_" + topVoted + "'><em>(+" + db["box"+i][topVoted] + ") " + overflowCheck(topVoted) + "</em></li>";
      
      			contenders = Object.keys(db["box" + i]);
      			contenders.sort(function() {return 0.5 - Math.random()});
      			
      			for (j = 0; j < Math.min(7, contenders.length); j ++){
      				
      				k = contenders[j];
      				if (k != topVoted)
      				html += "<li title='" + k + "' id='" + i + "_" + k + "'>(+" + db["box"+i][k] + ") " + overflowCheck(k) + "</li>";
      			}
      			$("#box" + i + " ul").html(html);
          }
    		}

      /*
      } else {
      // anarchy
        for (i = 1; i <= 10; i ++) {
        html = '';
          html += '<ul id='+i+'>'
          for (j = 0; j <= 17; j++) {
            elet = '';
            if (db.anarchy) {
              if (db.anarchy['box'+i]) {
                if (db.anarchy['box'+i]['letter'+j]) {
                  elet = db.anarchy['box'+i]['letter'+j];
                } else {
                  elet = '';
                }
              }
            }
            
            if (i in disabledBoxes) {
              ronly = 'disabled="disabled"';
            } else {
              ronly = '';
            }
            html += '<li><input id="'+i+'-'+j+'" type="text" placeholder="?" maxlength="1" value="'+elet+'"  onClick="this.select();" '+ronly+'/></li>';
          }
          html += '</ul>';
      		$('#box' + i).html(html);
    		}
        
      }
      */
  
    
  		// clicking or adding a vote
      $(document).on('click', 'li', function(e){
        if (democracy) {
    			listID = e.currentTarget.id.split("_");
    			boxID = listID[0];
    			boxName = listID[1];
    			if ($("#i" + boxID).attr("disabled") != 'disabled'){
    				newVal = db["box" + boxID][boxName]+1;
    				data.child("box" + boxID).child(boxName).set(newVal);
    		    disableVote(boxID, boxName);
    	      updateGrid();
    	    }
    	  }
  		});
  	});
  }
  
	// adding a value to a specific box
	$("input").keypress(function(e) {
	 if (democracy) {
	    if(e.which == 13) {
	    	  sel = e.currentTarget;
	        submittedValue = sel.value;
	        submittedID = sel.id.substring(1);
	        
          if (db['box'+submittedID]) {
  	        if (db['box'+submittedID][submittedValue]) {
  	         // entry already exists
  	         
    				newVal = db["box" + submittedID][submittedValue]+1;
    				data.child("box" + submittedID).child(submittedValue).set(newVal);
  	         
  	        } else {
  	        
  	         // add to entry
  	         t = {};
  	         t[submittedValue.replace(/\W/g, '')] = 1;
  	         data.child("box" + submittedID).update(t);
  	        }
	        } else {
             t = {};
             t[submittedValue.replace(/\W/g, '')] = 1;
             data.child("box" + submittedID).update(t);
          }
	        disableVote(submittedID, submittedValue);
	        updateGrid();
	    }
    } else {
     // anarchy
    }
	});

  $(document).on('keypress', 'input', function(e) {
    if (!democracy) {
	    	  sel = e.currentTarget;
	        submittedID = sel.id.substring(0,1);
	        submittedLetter = sel.id.split('-')[1]
	        var r = String.fromCharCode(e.which);
  				data.child("anarchy").child("box" + submittedID).child("letter" + submittedLetter).set(r);
	        
  		    disableVote(submittedID, r);
  	      updateGrid();
  	 }
  });

	// close off box for vote
	disableVote = function(boxID, newVal){
	 
	 if (democracy) {
		$("#i" + boxID).attr({disabled:true});
		$("#i" + boxID).css({width: "140px",
							 color: "#009c07",
							 backgroundColor: "inherit",
							 border: "none",
							 outline: "none",
							 left: "0px"});
	    $("#i" + boxID).val("Voted for " + newVal + "!")
	 } else {
	    $("#box" + boxID).find("input").attr("disabled","disabled") ;
	    disabledBoxes.push(boxID)
	 }
	}

	// fetch top voted
	function getTopVoted(ob){
		max = 0
		key = ""
		for (j in ob){
			if (ob[j] > max){
				max = ob[j];
				key = j;
			}
		}
		return key;
	}

	// truncate text
	function overflowCheck(text){
		if (text.length > 20){
			return text.substring(0,18) + "...";
		}
		return text
	}
	
	updateGrid();
	window.setInterval(updateGrid, 5000);
});
