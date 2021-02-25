




	jQuery(document).ready(function($)
	{



		// Prevent page refreshing on submit
		$("#form-search").submit( function(e){
        	e.preventDefault();
    	});


		var container = $("#container__h-site-search").width();
		var search = $("#contaner__search-input").width();

		var diff = ( container - search ) / 2;

		// Inital display with empty search field
		$("#contaner__search-input").css("transform", "translateX(" + diff + "px)").addClass("in-center");
		// $("#contaner__search-input").addClass("in-center");

		setTimeout( function() {
			$("#contaner__search-input").addClass("after-init");

			var container = $("#container__h-site-search").width();
			var search = $("#contaner__search-input").width();

			var diff = ( container - search ) / 2;

			$("#contaner__search-input").css("transform", "translateX(" + diff + "px)")

		}, 100);




		// Actions that "submit" the search
		$(document).on( "keypress", function(e)
		{
		    if ( e.which == 13 )
		    {
		    	var search_str = $("#search").val();

		    	if ( search_str.length )
		    	{
		    		do_search();
		    	}
		    }
		});


		$("body").on( "click", "#action__search-input__search-icon", function(e)
		{
			e.preventDefault();
			$(this).blur();

			do_search();
		});



		function do_search()
		{
			$("#search").blur();

			$("#contaner__search-input").removeClass("col-md-6 col-md-7 in-center").addClass("col-md-4");
			$("#contaner__search-input").css("transform", "translateX(0)");

			$("#container__h-site-search").removeClass("h-site-search--search-empty");

			window.scrollTo(0,0);

			show_filters_anim();

			fetchLots();
			fetchAuctions();
			fetchArticles();
		}


		function show_filters_anim()
		{
			$(".search-filter__anim-in-left").each( function( index, value )
			{	
				var wait = ( index * 200 ) + 500;
				var $this = $(this);

				setTimeout( function() {
					$this.removeClass("search-filter__anim-reset");
				}, wait);
			});
		}	



		/**
		 * ----------------------------------------------------------------------------------------
		 * Lots
		 * ----------------------------------------------------------------------------------------
		 */
		function displayLotsPlaceholders()
		{
			var items = [];

			for (var i = 0; i < 4; i++)
			{
				items.push(`
					<div class="col-12 col-sm-6 col-lg-4 col-xl-3 search-lot-result mt-3">
						<div class="ui card card--alt">
							<div class="image">
								<div class="ui placeholder">
									<div class="square image"></div>
								</div>
							</div>
							<div class="content--alt">
								<div class="ui placeholder placeholder--alt">
									<div class="header">
										<div class="very short line"></div>
										<div class="medium line"></div>
									</div>
									<div class="paragraph">
										<div class="short line"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				`);
			}

			$(".search-lot-result").remove();

			$("#container__lots__marker").after( items.join( "" ) );
		}



		function getLotsHandler( data )
		{
			shuffleArray(data);

			var num = getRandomIntInclusive( 6, 9 );
			// var num = getRandomIntInclusive( 1, 3 );
			data    = data.slice( 0, num );

			var items = [];

			$.each( data, function( key, val )
			{
				items.push(`
					<div class="col-12 col-sm-6 col-lg-4 col-xl-3 search-lot-result mt-3 anim-search-result anim-search-result--reset">
						<figure>
							<img src="${val.image}" alt="" class="mw-100" width="450" height="250">
						</figure>
						<aside class="search-lot--content py-3 px-2 text-center">
							<span class="text-grey mb-1 d-block">Lot ${val.lotno}</span>
							<h3 class="font-weight-bold text-grey">${val.title}</h3>
							<p class="mb-1">${val.sub_title}</p>
							<p class="font-weight-bold text-grey">${val.estimate}</p>
						</aside>
					</div>
				`);
			});

			$(".search-lot-result").remove();

			$("#container__lots__marker").after( items.join( "" ) );

			$(".search-lot-result.anim-search-result--reset").each( function( index, value )
			{	
				var wait = ( index * 100 );
				var $this = $(this);

				setTimeout( function() {
					$this.removeClass("anim-search-result--reset");
				}, wait);
			});
		}



		function fetchLots()
		{
			displayLotsPlaceholders();

			setTimeout( function() {
				$.ajax({
					dataType : "json",
					url      : "./content__lots.json",
					success  : getLotsHandler
				});
			}, 2500 );
		}


		/**
		 * ----------------------------------------------------------------------------------------
		 * Auctions
		 * ----------------------------------------------------------------------------------------
		 */
		function displayAuctionsPlaceholders()
		{
			var items = [];

			for (var i = 0; i < 2; i++)
			{
				items.push(`
					<div class="col-12 col-lg-6 mt-3 search-auction-result">
						<div class="ui-placeholder__auctions-wrap">
							<div class="ui fluid placeholder">
							  <div class="image header">
							    <div class="line"></div>
							    <div class="line"></div>
							  </div>
							  <div class="paragraph">
							    <div class="line"></div>
							    <div class="line"></div>
							    <div class="line"></div>
							  </div>
							</div>
						</div>			
					</div>
				`);
			}

			$(".search-auction-result").remove();

			$("#container__auctions__marker").after( items.join( "" ) );
		}



		function getAuctionsHandler( data )
		{
			shuffleArray(data);

			var num = getRandomIntInclusive( 6, 9 );
			// var num = getRandomIntInclusive( 1, 3 );
			data    = data.slice( 0, num );

			var items = [];

			$.each( data, function( key, val )
			{
				items.push(`
					<div class="col-12 col-lg-6 mt-3 search-auction-result anim-search-result anim-search-result--reset">
					    <div class="widget-fluid d-flex flex-column flex-md-row text-center justify-content-lg-center align-items-center w-100">
					        <div class="widget-fluid--body bg-white">
					        	<span class="widget-fluid--body__tag text-uppercase">${val.location}</span>  
					            <h4 class="widget-fluid--body__headline">
					                <a href="#0" class="link-overlay font-weight-bold">${val.title}</a>
					            </h4>
					            <span class="widget-fluid--body__date">${val.date}</span>
					            <span class="widget-fluid--body__date d-block text-grey">${val.time}</span>
					        </div>
					        <div class="widget-fluid--image">
					            <figure>
					                <img src="${val.image}" alt="${val.title}" class="mw-100" width="260" height="400">
					            </figure>
					        </div>
					    </div>
					</div>
				`);
			});

			$(".search-auction-result").remove();

			$("#container__auctions__marker").after( items.join( "" ) );

			$(".search-auction-result.anim-search-result--reset").each( function( index, value )
			{	
				var wait = ( index * 100 );
				var $this = $(this);

				setTimeout( function() {
					$this.removeClass("anim-search-result--reset");
				}, wait);
			});
		}



		function fetchAuctions()
		{
			displayAuctionsPlaceholders();

			setTimeout( function() {
				$.ajax({
					dataType : "json",
					url      : "./content__auctions.json",
					success  : getAuctionsHandler
				});
			}, 2500 );
		}



		/**
		 * ----------------------------------------------------------------------------------------
		 * Articles
		 * ----------------------------------------------------------------------------------------
		 */
		function displayArticlesPlaceholders()
		{
			var items = [];

			for (var i = 0; i < 3; i++)
			{
				items.push(`
					<div class="col-12 col-md-6 col-lg-4 grid-item search-article-result">
						<div class="ui-placeholder__auctions-wrap">
							<div class="ui fluid placeholder">
							  <div class="image header">
							    <div class="line"></div>
							    <div class="line"></div>
							  </div>
							  <div class="paragraph">
							    <div class="line"></div>
							    <div class="line"></div>
							    <div class="line"></div>
							  </div>
							</div>
						</div>
					</div>
				`);
			}

			$(".search-article-result").remove();

			$("#container__articles__marker").after( items.join( "" ) );
		}



		function getArticlesHandler( data )
		{
			shuffleArray(data);

			var num = getRandomIntInclusive( 6, 9 );
			data    = data.slice( 0, num );

			var items = [];

			$.each( data, function( key, val )
			{
				items.push(`
					<div class="col-12 col-md-6 col-lg-4 grid-item search-article-result anim-search-result anim-search-result--reset">
						<aside class="favourite d-flex flex-1 mt-3 bg-white position-relative align-items-center">
							<figure>
								<img src="${val.image}" alt="Image" width="150" height="150">
							</figure>
							<div class="favourite-content p-3 flex-1">
								<h3 class="font-weight-bold"><a href="#0" class="link-overlay">${val.title}</a></h3>
								<!-- <a href="#0" role="button" class="btn btn-tertiary btn-sm l-spacing-75">Read Article</a> -->
							</div>
						</aside>
					</div>
				`);
			});

			$(".search-article-result").remove();

			$("#container__articles__marker").after( items.join( "" ) );

			$(".search-article-result.anim-search-result--reset").each( function( index, value )
			{	
				var wait = ( index * 100 );
				var $this = $(this);

				setTimeout( function() {
					$this.removeClass("anim-search-result--reset");
				}, wait);
			});
		}



		function fetchArticles()
		{
			displayArticlesPlaceholders();

			setTimeout( function() {
				$.ajax({
					dataType : "json",
					url      : "./content__posts.json",
					success  : getArticlesHandler
				});
			}, 2500 );
		}





		/**
		 * Applying the filters, in this order for demo:
		 *
		 * - Categories
		 * - Upcoming
		 * - Other > Lots
		 */

		// Categories
		$("body").on( "click", "#action__categories-dropdown--save", function(e)
		{
			$('#filter2').popup("hide");


			// add counter to button
			var num_categories = $("#fpopup2 input:checked").length;

			if ( num_categories >= 1 )
			{
				// change color
				$('#filter2').addClass("primary");

				if ( $("#counter__categories").length )
				{
					$("#counter__categories").html( num_categories );
				}
				else
				{
					$('#filter2').addClass("has-counter");

					var counter = `<span id="counter__categories" class="ui black circular label">${num_categories}</span>`;

					$('#filter2').append( counter );
				}


				$(".search-lot-result").eq(1).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
				$(".search-lot-result").eq(3).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
				$(".search-auction-result").eq(0).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
				$(".search-auction-result").eq(2).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
			}
			else
			{
				$('#filter2').removeClass("primary");
				$('#filter2').removeClass("has-counter");
				$("#counter__categories").remove();
			}
		});



		// Upcoming
		$("body").on( "click", "#action__upcoming-only-dropdown--save", function(e)
		{
			$('#filter1').popup("hide");


			// add counter to button
			var is_checked = $("#checkbox__upcoming_only:checked").length;

			if ( is_checked >= 1 )
			{
				// change color
				$('#filter1').addClass("primary");

				$(".search-lot-result").eq(1).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
				$(".search-auction-result").eq(1).css( 'transition', 'none' ).addClass("removed").fadeOut(500, function()
				{
					$(".removed").remove();
				});
			}
			else
			{
				$('#filter1').removeClass("primary");
			}
		});



		// Other
		$("body").on( "click", "#action__filter-dropdown--save", function(e)
		{
			$('#filter3').popup("hide");


			// add counter to button
			var num_filters = $("#fpopup3 input:checked").length;

			if ( num_filters >= 1 )
			{
				// change color
				$('#filter3').addClass("primary");

				if ( $("#counter__filter").length )
				{
					$("#counter__filter").html( num_filters );
				}
				else
				{
					$('#filter3').addClass("has-counter");

					var counter = `<span id="counter__filter" class="ui black circular label">${num_filters}</span>`;

					$('#filter3').append( counter );
				}

				$("#container__auctions, #container__articles").fadeOut(500);

			}
			else
			{
				$('#filter3').removeClass("primary");
				$('#filter3').removeClass("has-counter");
				$("#counter__filter").remove();
			}
		});




		// Clear
		$("body").on( "click", "#clear", function(e)
		{
			$('#filter1').popup("hide");
			$('#filter2').popup("hide");
			$('#filter3').popup("hide");

			$('#filter1').removeClass("primary");

			$('#filter2').removeClass("primary");
			$('#filter2').removeClass("has-counter");
			$("#counter__categories").remove();

			$('#filter3').removeClass("primary");
			$('#filter3').removeClass("has-counter");
			$("#counter__filter").remove();


			$("#fpopup1 input, #fpopup2 input, #fpopup3 input").prop( "checked", false );

			$("#container__auctions, #container__articles").fadeIn(500);

			do_search();
		});









		// Cancel buttons
		$("body").on( "click", "#action__upcoming-only-dropdown--cancel", function(e)
		{
			$('#filter1').popup('hide');
		});

		$("body").on( "click", "#action__categories-dropdown--cancel", function(e)
		{
			$('#filter2').popup('hide');
		});

		$("body").on( "click", "#action__filter-dropdown--cancel", function(e)
		{
			$('#filter3').popup('hide');
		});






	});	// ready();









	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};


	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	}


	function getRandomIntInclusive( min, max ) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	function compareTimestamp( a, b ) {
		if ( a.timestamp < b.timestamp ) return -1;
		if ( a.timestamp > b.timestamp ) return 1;
		return 0;
	}

