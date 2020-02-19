/*******************************************************************
****************************AUTHOR: Runc****************************
*******************************************************************/
/*获取链接参数*/
function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for(var i=0;i<vars.length;i++){
	   var pair = vars[i].split("=");
	   if(pair[0] == variable){return pair[1];}
   }
   return(false);
}
/*获取ObjectUrl*/
function getObjectUrl(file) {  
	var url = null;
	if(window.createObjectURL != undefined){  
	url = window.createObjectURL(file);
	}else if(window.URL != undefined){ // mozilla(firefox)  
	url = window.URL.createObjectURL(file);
	}else if(window.webkitURL != undefined){ // webkit or chrome  
	url = window.webkitURL.createObjectURL(file);
	}
	return url;  
}

/*增加版权信息*/
function addCopyright() {
	var body_element = document.getElementsByTagName('body')[0];
	var selection = window.getSelection();
	var copyright = "<br>--------------------------<br>信息来源于:<a href = 'https://mobilex5.com'>MobileX5.com</a>.<br>本站数据仅供个人使用,<br>严禁用于商业用途.<br>";
	var copytext = selection + copyright;
	var newdiv = document.createElement('div');
	newdiv.style.opacity='0';
	body_element.appendChild(newdiv);
	newdiv.innerHTML = copytext;
	selection.selectAllChildren(newdiv);
	window.setTimeout(function(){
	body_element.removeChild(newdiv);
	},0);
}

/*禁止滚动条滚动*/
function disableScroll(){
	document.documentElement.style.overflow='hidden';
	document.body.style.position='fixed';
	document.body.style.top='0px';
	document.body.style.width='100%';
}
/*允许滚动条滚动*/
function enableScroll(){
	document.documentElement.style.overflow='auto';
	document.body.style.position='static';
}
/*检测屏幕宽度判断是否为移动设备*/
function isMobile(){
	if(window.screen.availWidth  < 1024){//设备宽度小于1024像素
		return true;
	}else{
		return false;
	}
}
/*判断是否为iOS设备*/
function isiOS(){
    if(navigator.platform.match(/iphone|ipad/i)){//IOS
        return true;
    }else{
        return false;
    }
}
/*判断是否为数字*/
function checkNum(input){
	var reg=/^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
	if(reg.test(input)){
		return true;
	}else{
		return false;
	}
}
/*判断是否在QQ或微信中*/
function isInApp(){
	var ua = navigator.userAgent.toLowerCase();
	if(/(MicroMessenger\/[0-9])|(QQ\/[0-9])/i.test(ua)){
		return true;
	}else{
		return false;
	}
}
/*弹出提示*/
function notificate(message,timeout=2000,action=null){
	clearTimeout($(".notification").data("sign0"));
	clearTimeout($(".notification").data("sign1"));
	clearTimeout($(".notification").data("sign2"));
	clearTimeout($(".notification").data("sign3"));
	//初始化
	$(".notification").html('<div class="notificationText left"></div><div class="notificationText right"></div><div id="countdown" class="countdown"><div id="leftCircle" class="leftCircle"></div><div id="rightCircle" class="rightCircle"></div><div id="leftCircleMask" class="leftCircleMask"></div><div id="countdownText" class="countdownText"></div></div>');
	//定时淡出
	if(timeout == "permanent"){
		//do nothing
	}else{
		$(".notification").data("sign0",setTimeout(function(){$(".notification").fadeOut();},timeout-500));
	}
	//弹出主体
	$(".notificationText.left").html(message);
	$(".notification").css("bottom","-50px")
	$(".notification").show();
	$(".notificationText.left,.notificationText.right").hide();
	$(".notification").animate({bottom:"0px"},300);
	if(action == null){
		//倒计时
		if(timeout != "permanent"){
			$(".notificationText.right,#leftCircleMask").hide();
			$("#countdown,#leftCircle,#rightCircle").show();
			$(".notificationText.left,#countdown").delay(350).fadeIn(120);
			$(".notification").data("timeout",timeout);
			countdown(parseInt(timeout/1000));
			setTimeout(function(){
				$("#leftCircle").css({"transform":"rotate(-180deg)","transition":"transform "+$(".notification").data("timeout")/2000+"s linear 0s"});
			},0);
			$(".notification").data("sign1",setTimeout(function(){
				$('#leftCircle').hide();
				$('#leftCircleMask').show();
				},$(".notification").data("timeout")/2));
			$(".notification").data("sign2",setTimeout(function(){
				$('#rightCircle').css({'transform':'rotate(-180deg)','transition':'transform '+$(".notification").data("timeout")/2000+'s linear 0s'});
			},$(".notification").data("timeout")/2));
		}
	}else{
		//直接显示操作
		$("#countdown").hide();
		$(".notificationText.left,.notificationText.right").delay(350).fadeIn(120);
		$(".notificationText.right").html(action);
	}
}
function countdown(number){
	if(number != 0){
		if(number > 0){
			$("#countdownText").text(number);
			number = number - 1;
			$("#countdownText").data("number",number);
			$(".notification").data("sign3",setTimeout(function(){
				countdown($("#countdownText").data("number"));
			},1000));
		}else{
			$("#countdownText").text(number);
			number = number + 1;
			$("#countdownText").data("number",number);
			$(".notification").data("sign3",setTimeout(function(){
				countdown($("#countdownText").data("number"));
			},1000));
		}
	}
}
/*弹出Toast*/
function popup(html,timeout=5000,callback=function(){}){
	M.toast({
		html:html,
		displayLength:timeout,
		completeCallback:callback
	});
}
/*设置新Modal*/
var modalQueue = Array();
modalQueue["count"] = 0;
modalQueue["title"] = Array();
modalQueue["content"] = Array();
modalQueue["primary"] = Array();
modalQueue["secondary"] = Array();
modalQueue["primaryCallback"] = Array();
modalQueue["secondaryCallback"] = Array();
function addModal(title,content,primary="确认",secondary="取消",primaryCallback=false,secondaryCallback=false,important=false){
	if($(".modal").css("display") != "none" && important == false){
		modalQueue["title"].unshift(title);
		modalQueue["content"].unshift(content);
		modalQueue["primary"].unshift(primary);
		modalQueue["secondary"].unshift(secondary);
		modalQueue["primaryCallback"].unshift(primaryCallback);
		modalQueue["secondaryCallback"].unshift(secondaryCallback);
		modalQueue["count"]++;
		return;
	}else if($(".modal").css("display") != "none"){
		modalQueue["title"].push(title);
		modalQueue["content"].push(content);
		modalQueue["primary"].push(primary);
		modalQueue["secondary"].push(secondary);
		modalQueue["primaryCallback"].push(primaryCallback);
		modalQueue["secondaryCallback"].push(secondaryCallback);
		modalQueue["count"]++;
		return;
	}
	//初始化
	$(".modalButton:not(.recommand)").unbind();
	$(".modalButton.recommand").unbind();
	//设置标题
	$(".modalTitle").html(title);
	//设置内容
	$(".modalText").html(content);
	//设置主要按钮文字
	if(primary != ""){
		$(".modalButton.recommand").show();
		$(".modalButton.recommand").html(primary);
	}else{
		$(".modalButton.recommand").hide();
	}
	//设置次要按钮文字
	if(secondary != ""){
		$(".modalButton:not(.recommand)").show();
		$(".modalButton:not(.recommand)").html(secondary);
	}else{
		$(".modalButton:not(.recommand)").hide();
	}
	//绑定次要按钮事件(如果有)
	if(secondaryCallback){
		$(".modalButton:not(.recommand)").on("click",secondaryCallback);
	}else{
		$(".modalButton:not(.recommand)").on("click",function(){
			hideModal();
		});
	}
	//绑定主要按钮事件(如果有)
	if(primaryCallback){
		$(".modalButton.recommand").on("click",primaryCallback);
	}else{
		$(".modalButton.recommand").on("click",function(){
			hideModal();
		});
	}
	//设置modal四边距离
	var height = $(".modal").css("height").replace("px","")/2;
	var width =  $(".modal").css("width").replace("px","")/2;
	 $(".modal").css("top","calc(50% - "+height+"px");
	 $(".modal").css("left","calc(50% - "+width+"px");
	//设置遮罩模式
	$(".modalmask").data("mode","modal");
	//显示Modal和遮罩
	$(".modal,.modalmask").fadeIn(300);
}
/*隐藏现有Modal*/
function hideModal(){
	if($(".modal").css("display") != "none"){
		//初始化遮罩模式
		$(".modalmask").data("mode","");
		//隐藏Modal和遮罩
		$(".modal,.modalmask").fadeOut(300);
		//移除设置的遮罩图层
		$(".modalmask").attr("style","");
	}
	setTimeout(function(){
		if(modalQueue["count"] != 0){
			modalQueue["count"]--;
			var title = modalQueue["title"].pop();
			var content = modalQueue["content"].pop();
			var primary = modalQueue["primary"].pop();
			var secondary = modalQueue["secondary"].pop();
			var primaryCallback = modalQueue["primaryCallback"].pop();
			var secondaryCallback = modalQueue["secondaryCallback"].pop();
			addModal(title,content,primary,secondary,primaryCallback,secondaryCallback,false);
		}
	},350);
}
/*显示现有Modal*/
function showModal(){
	//设置遮罩模式
	$(".modalmask").data("mode","modal");
	//设置遮罩图层
	$(".modalmask").css("z-index",900);
	//显示Modal和遮罩
	$(".modal,.modalmask").fadeIn();
}
/*检测是否在QQ/微信中打开*/
if(isInApp()){
	addModal("重要提示","使用QQ或微信访问本站可能导致无法预料的问题(如登录频繁失效、主题跳动、操作不流畅等)，请使用Chrome(推荐)或系统浏览器打开。","确认","忽略");
}

/*复制时增加版权信息*/
document.oncopy = addCopyright;