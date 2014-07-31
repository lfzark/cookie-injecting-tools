var URL='';
var btns;
function $(id) {
  return document.getElementById(id);
}

function get_cookie_edit(url,cookie_name){
	var cookie_r;
	 chrome.cookies.getAll({name:cookie_name}, function(cookies) {
            if (cookies.length == 0)
            return;
       

 	     for (var i = 0; i < cookies.length ; i++) {
             	
             	 if((cookies[i].domain==url.replace(/^\s+|\s+$/g, ""))&&(cookies[i].name==cookie_name.replace(/^\s+|\s+$/g, ""))) {
             	 	
             	 	 change_tab('edit_cookies');
             	 	 $('m_domain').value=url;
             	 	 $('m_name').value=cookie_name;
             	 	 $('m_value').value=cookies[i].value;
             	 	 $('m_expire').value=cookies[i].expirationDate;
 					 $('m_path').value=cookies[i].path;
 					 $('m_secure').checked=(cookie.secure ? true : false);
 					 $('m_httponly').checked=(cookie.httpOnly ? true : false);;
             	 	 break;
             	 }	
             	 
             	}

   });
 
}

function set_cookie(){


}
function parse_and_set_cookies(cookies){

	cookies=cookies.replace(/^\s+|\s+$/g, "");
	if(!cookies||cookies.length==0){
		$('notice').innerHTML = 'Please Input Your Costum Cookie Values';
		$('notice').setAttribute('class','label label-warning');
		return;
	}
	if (!chrome.cookies) {
	  chrome.cookies = chrome.experimental.cookies;
	}
	domain = URL.split('/')[2];
	if($('domain').value != domain){
		domain = $('domain').value;
	}	
	
	url = URL.split('/')[0] + '//' + domain;

	cookie_array = cookies.split(';');

	d = new Date();
	expired = 365*10;
	e = d.setTime(d.getTime()/1000+expired*24*3600); //second
	

	for(i in cookie_array){
		c = cookie_array[i].replace(/^\s+|\s+$/g, "");
		if(!c) continue;
		k = c.split('=')[0].replace(/^\s+|\s+$/g, "").replace(' ', '+');
		v = c.split('=')[1].replace(/^\s+|\s+$/g, "").replace(' ', '+');
		chrome.cookies.set({
			'url': url,
			'name': k,
			'value': v,
			'path': '/',
			'domain': $('domain').value,
			//'httpOnly' :'false',
			//'secure ':'false',
			'expirationDate': e
		});
 
//storeId 
	};

	$('notice').innerHTML = 'Inject Success';
	$('notice').setAttribute('class','label label-success');
}
function listener(info) {
alert("cookies changed");
init_view_data($('domain_filter').value);
   
}

function startListening() {
  
  chrome.cookies.onChanged.addListener(listener);
}

function stopListening() {
  chrome.cookies.onChanged.removeListener(listener);
}
// <span class="label label-success">Inject Success</span>
function change_tab(change_id){
  		   lis=$('nav_menu').getElementsByTagName('li');
		   for( j=0; j<4; j++){
	 	   
	 	   if(lis[j].id!=change_id){
	 	 
	 	  	 $('fun_'+lis[j].id).style.display="none";
	 	  	 $(lis[j].id).setAttribute('class','');
	 	   }
	 	   else{

	 	  	 $('fun_'+lis[j].id).style.display="block";
	 	     $(lis[j].id).setAttribute('class','active');
           
	 	  }
	    }
}

function init_view_data(filter)
{


     var div = $('fun_view_cookies'); 
     if($('data_table')!=null)
     div.removeChild($('data_table'));
     document.createElement("table");
     var table = document.createElement("table");
     table.setAttribute("id","data_table");
     table.style.overflow='scro';
     table.setAttribute('class','table table-hover');
     
     chrome.cookies.getAll({}, function(cookies) {
            if (cookies.length == 0)
            return;

            cookies_string='';
            for (var i = 0; i < cookies.length - 1; i++) {
             //f (cookies[i].httpOnly == false) {
             	 if(cookies[i].domain.indexOf(filter) > 0||cookies[i].domain==filter )
 			{
             	var row= table.insertRow();
             	if(cookies[i]!=null&&cookies[i].name!=null&&cookies[i].value!=null){
                // alert(cookies[i].name + "=" + cookies[i].value + ";");
                 cookie_value=cookies[i].domain + "=" + cookies[i].name;
                 //cookies_string+=cookie_value;
                 var cell = row.insertCell();
				 cell.innerHTML=' <button id="'+cookie_value+'" name="edit_btn" class="btn btn-mini"   type="button">Edit</button>';
				 
				 cell = row.insertCell();
				 cell.innerHTML=cookies[i].domain;
                 cell = row.insertCell();
				 cell.innerHTML=cookies[i].name;
				 cell = row.insertCell();
				 cell.innerHTML=cookies[i].value;
				 cell.style.width='30px';
				}
		
              //}
            }

          }
          //alert(document.getElementsByName('edit_btn').length);
          btns =document.getElementsByName('edit_btn')
          for(i = 0 ; i<btns.length;i++){+

  			btns[i].addEventListener('click', function () {
  			get_cookie_edit(this.id.split('=')[0],this.id.split('=')[1]);
		  });

          }
           // $('cookie_values').value=cookies_string;
  		//alert(cookies_string);
        });
		div.appendChild(table); 
	

}
function gen_cookie_url(domain,secure,path) {
  var url = "http" + (secure ? "s" : "") + "://" + domain +
            path;
  return url;
}

function init(){
change_tab('inject');
//init_view_data("");


chrome.tabs.getSelected(null,function(tab) {  
	URL=tab.url;
	$('domain').value = URL.split('/')[2];
});


$('inject_btn').addEventListener('click', function () {
	parse_and_set_cookies($('cookie_values').value);

});

	$('domain_filter').addEventListener('input', function () {
	init_view_data($('domain_filter').value);
	});
 
		var i;
	    lis=$('nav_menu').getElementsByTagName('li');
		

  		for( i = 0 ;i <lis.length ; i++){
  			 
  			$(lis[i].id).addEventListener('click', function () {
        	change_tab(this.id);
		});

        }
/*
 $('m_name').value 
             	 	 $('m_value').value 
             	 	 $('m_expire').value 
             	 	 */

  $('del_btn').addEventListener('click', function () {
  		 url=gen_cookie_url($('m_domain').value,( $('m_secure').checked? true : false), $('m_path').value);
  		 chrome.cookies.remove({"url": url,"name":$('m_name').value });
  		 $('op_info').innerHTML = 'Delete Successfully';
		 $('op_info').setAttribute('class','label label-success');
	});

   $('add_btn').addEventListener('click', function () {
  	
 		 //alert(gen_cookie_url($('m_domain').value,( $('m_secure').checked? true : false), $('m_path').value));
 		  chrome.cookies.set({
  		  url:  gen_cookie_url($('m_domain').value,( $('m_secure').checked? true : false), $('m_path').value),
   		  name: $('m_name').value,
   		  value:$('m_value').value,
   		  expirationDate: parseInt($('m_expire').value),
   		  path:	 $('m_path').value,
   		  secure:( $('m_secure').checked? true : false),
   		  httpOnly: ($('m_httponly').checked ? true : false)
		  }, function(cookie){
   	
  		
			});
          $('op_info').innerHTML = 'Add Successfully';
		  $('op_info').setAttribute('class','label label-success');
	});


   $('modify_btn').addEventListener('click', function () {
  		
  		
  		  chrome.cookies.set({
  		  url:  gen_cookie_url($('m_domain').value,( $('m_secure').checked? true : false), $('m_path').value),
   		  name: $('m_name').value,
   		  value:$('m_value').value,
   		  expirationDate: parseInt($('m_expire').value),
   		  path:	 $('m_path').value,
   		  secure:( $('m_secure').checked? true : false),
   		  httpOnly: ($('m_httponly').checked ? true : false)
		  }, function(cookie){
   	
  		
			});

  		 $('op_info').innerHTML = 'Modify Successfully';
		 $('op_info').setAttribute('class','label label-success');

	});


 	$('auto_reload_btn').addEventListener('click', function () {
 	if(!$('advanced_option_info').value){
	
  	 startListening();
  	 $('advanced_option_info').innerHTML = 'start listening..';
	$('advanced_option_info').setAttribute('class','label label-success');
	$('advanced_option_info').value=true;
  	 }
  	 else{
  	
  	 stopListening();
  	 $('advanced_option_info').innerHTML = 'stop listening..';
	$('advanced_option_info').setAttribute('class','label label-success');
		$('advanced_option_info').value=false;
  	 }
	});
	//parse_and_set_cookies($('cookie_values').value);

	//chrome.cookies.remove({});
	


/*
chrome.cookies.onChanged.addListener(function(object changeInfo) {
alert(changeInfo.cookie);
});
*/
}


document.addEventListener('DOMContentLoaded', init);

