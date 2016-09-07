$(document).ready(function(){
  var db;
  
  var disabledBoxes = [];
  
	// set up initial box
	for (i = 1; i <= 10; i ++){
		html = "<ul></ul>" + 
			   //"<a id='more' href='#'>more...</a>" + 
			   "<input id='i" + i + "'type='text' maxlength='50' placeholder='suggest a name' />";
		$("#box" + i).html(html)
	}

	// set up list values
	var data = new Firebase('https://poofytoo.firebaseio.com/basketeer/');

	var updateGrid = function() {
  	data.once('value', function(snapshot) {
  		db = snapshot.val();
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
    
  		// clicking or adding a vote
      $(document).on('click', 'li', function(e){
  			listID = e.currentTarget.id.split("_");
  			boxID = listID[0];
  			boxName = listID[1];
  			if ($("#i" + boxID).attr("disabled") != 'disabled'){
  				newVal = db["box" + boxID][boxName]+1;
  				data.child("box" + boxID).child(boxName).set(newVal);
  		    disableVote(boxID, boxName);
  	      updateGrid();
  	    }
  		});
  	});
  }
  
	// adding a value to a specific box
	$("input").keypress(function(e) {
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
	});

	// close off box for vote
	disableVote = function(boxID, newVal){
		$("#i" + boxID).attr({disabled:true});
		$("#i" + boxID).css({width: "140px",
							 color: "#009c07",
							 backgroundColor: "inherit",
							 border: "none",
							 outline: "none",
							 left: "0px"});
	    $("#i" + boxID).val("Voted for " + newVal + "!")
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
