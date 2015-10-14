/*  search module  */
$(function() {
	var $doc         = $(document.body),
	$searchBox       = $('#searchBox'),
	$tip             = $('#searchBox .tip'),
	$kw              = $('#searchBox .kw'),

	$searchRe        = $('#searchRe'),
	$searchReListBox = $('#searchReListBox'),

	$searchNoresult  = $('#searchNoresult'),
	$retry           = $('#searchNoresult .retry'),
	$create          = $('#searchNoresult .create'),

	tpl_searchReListBox = ''+
			'<div class="searchReListBox" id="searchReListBox" style="display:none">'+
				'<h3>搜索到2个结果</h3>'+
				'<div class="searchReList">'+
					'<div class="listMod">'+
						'<div class="top">'+
							'<h4>大家一起跑跑跑</h4>'+
							'<span class="num">共158人</span>'+
							'<p class="msg">我们一起来吧，我读书少你不要骗我我们一起来吧，我读书少你不要骗我</p>'+
						'</div>'+
						'<div class="picList">'+
							'<img src="tmp/p2.jpg" alt=""/><img src="tmp/p2.jpg" alt=""/><img src="tmp/p2.jpg" alt=""/><img src="tmp/p2.jpg" alt=""/><img src="tmp/p2.jpg" alt=""/>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';

	$kw.on('keyup', function(e) {
		if ($kw.val().trim().length > 0 && e.which == 13) doSearch();
	})
	.on('focus blur input', function() {
		$kw.val() == '' ? $tip.show() : $tip.hide();
	});

	$retry.on('click', doResearch);

	$create.on('click', doCreate);

	function doSearch() {
		alert('do search');
	}

	function doResearch() {
		alert('do research');
	}

	function doCreate() {
		alert('do create');
	};
})
