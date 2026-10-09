(function () {
	var root = document.documentElement;
	var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	var store = {
		get: function (key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
		set: function (key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
	};

	/* ---------- Theme toggle ---------- */
	var themeBtn = document.getElementById('theme-btn');
	var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
	var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/></svg>';

	function currentTheme() {
		var set = root.getAttribute('data-theme');
		if (set === 'dark' || set === 'light') return set;
		return darkQuery.matches ? 'dark' : 'light';
	}
	function paintThemeIcon() {
		var dark = currentTheme() === 'dark';
		themeBtn.innerHTML = dark ? SUN : MOON;
		themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
	}
	themeBtn.addEventListener('click', function () {
		var next = currentTheme() === 'dark' ? 'light' : 'dark';
		root.setAttribute('data-theme', next);
		store.set('jep-theme', next);
		paintThemeIcon();
	});
	if (darkQuery.addEventListener) darkQuery.addEventListener('change', paintThemeIcon);
	new MutationObserver(paintThemeIcon).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
	paintThemeIcon();

	/* ---------- Copy phone number ---------- */
	document.querySelectorAll('[data-copy]').forEach(function (btn) {
		var label = btn.textContent;
		function reset(ms) { setTimeout(function () { btn.textContent = label; }, ms); }
		function selectNumber() {
			var el = document.getElementById('phone-text');
			if (!el) return;
			var range = document.createRange();
			range.selectNodeContents(el);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
			btn.textContent = 'Number selected below';
			reset(2400);
		}
		btn.addEventListener('click', function () {
			var text = btn.getAttribute('data-copy');
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(function () {
					btn.textContent = 'Copied';
					reset(1800);
				}, selectNumber);
			} else {
				selectNumber();
			}
		});
	});

	/* ---------- Nav: highlight the section in view ---------- */
	var navBox = document.getElementById('nav-links');
	var navLinks = Array.prototype.slice.call(navBox.querySelectorAll('a'));
	if ('IntersectionObserver' in window) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				navLinks.forEach(function (a) {
					var on = a.getAttribute('href') === '#' + entry.target.id;
					a.classList.toggle('is-active', on);
					if (on && navBox.scrollWidth > navBox.clientWidth) {
						navBox.scrollTo({ left: a.offsetLeft - 24, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
					}
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		navLinks.forEach(function (a) {
			var section = document.querySelector(a.getAttribute('href'));
			if (section) spy.observe(section);
		});
	}

	/* ---------- Profile card: flip and tilt ---------- */
	var pcard = document.getElementById('pcard');
	var cardWrap = document.getElementById('card-wrap');
	pcard.addEventListener('click', function () {
		var flipped = pcard.classList.toggle('is-flipped');
		pcard.setAttribute('aria-pressed', String(flipped));
	});
	if (!reduceMotion.matches) {
		cardWrap.addEventListener('pointermove', function (e) {
			if (e.pointerType !== 'mouse') return;
			var r = pcard.getBoundingClientRect();
			var x = (e.clientX - r.left) / r.width - 0.5;
			var y = (e.clientY - r.top) / r.height - 0.5;
			pcard.style.setProperty('--ry', (x * 16).toFixed(2) + 'deg');
			pcard.style.setProperty('--rx', (-y * 16).toFixed(2) + 'deg');
		});
		cardWrap.addEventListener('pointerleave', function () {
			pcard.style.setProperty('--ry', '0deg');
			pcard.style.setProperty('--rx', '0deg');
		});
	}

	/* ---------- Skills filter ---------- */
	var chipBox = document.getElementById('chips');
	var chips = Array.prototype.slice.call(chipBox.querySelectorAll('.chip'));
	var skillBtns = Array.prototype.slice.call(document.querySelectorAll('[data-skill-filter]'));
	skillBtns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var f = btn.getAttribute('data-skill-filter');
			skillBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
			chipBox.classList.toggle('is-filtering', f !== 'all');
			chips.forEach(function (c) { c.classList.toggle('is-match', c.getAttribute('data-cat') === f); });
		});
	});

	/* ---------- Projects: hand of cards ---------- */
	var cards = Array.prototype.slice.call(document.querySelectorAll('.proj-card'));
	var narrowQuery = window.matchMedia('(max-width: 760px)');
	var pd = {
		suit: document.getElementById('pd-suit'),
		label: document.getElementById('pd-label'),
		title: document.getElementById('pd-title'),
		note: document.getElementById('pd-note'),
		play: document.getElementById('pd-play')
	};

	function visibleCards() {
		return cards.filter(function (c) { return !c.parentElement.hidden; });
	}
	function fanHand() {
		var vis = visibleCards();
		var mid = (vis.length - 1) / 2;
		var flat = narrowQuery.matches || reduceMotion.matches;
		vis.forEach(function (c, i) {
			var d = i - mid;
			c.style.setProperty('--rot', flat ? '0deg' : (d * 2.8).toFixed(2) + 'deg');
			c.style.setProperty('--arc', flat ? '0px' : (d * d * 2.4).toFixed(1) + 'px');
		});
	}
	function selectCard(card) {
		cards.forEach(function (c) { c.setAttribute('aria-pressed', String(c === card)); });
		var suit = card.getAttribute('data-suit');
		pd.suit.textContent = suit;
		pd.suit.classList.toggle('suit-red', suit !== '♠');
		pd.label.textContent = card.getAttribute('data-label');
		pd.title.textContent = card.getAttribute('data-title');
		pd.note.textContent = card.getAttribute('data-note');
		pd.play.hidden = card.getAttribute('data-play') !== 'true';
	}
	cards.forEach(function (c) {
		c.addEventListener('click', function () { selectCard(c); });
	});

	var projBtns = Array.prototype.slice.call(document.querySelectorAll('[data-proj-filter]'));
	projBtns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var f = btn.getAttribute('data-proj-filter');
			projBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
			cards.forEach(function (c) {
				c.parentElement.hidden = !(f === 'all' || c.getAttribute('data-cat') === f);
			});
			var selected = cards.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })[0];
			if (!selected || selected.parentElement.hidden) {
				var first = visibleCards()[0];
				if (first) selectCard(first);
			}
			fanHand();
		});
	});
	if (narrowQuery.addEventListener) narrowQuery.addEventListener('change', fanHand);
	fanHand();

	/* ---------- Mini game: Grid Memory ---------- */
	var PAIRS = [
		{ name: 'HTML & CSS', suit: '♦' },
		{ name: 'JavaScript', suit: '♠' },
		{ name: 'React', suit: '♥' },
		{ name: 'Node.js', suit: '♣' },
		{ name: 'SQL', suit: '♦' },
		{ name: 'Java', suit: '♠' }
	];
	var board = document.getElementById('board');
	var movesEl = document.getElementById('mem-moves');
	var pairsEl = document.getElementById('mem-pairs');
	var bestEl = document.getElementById('mem-best');
	var msgEl = document.getElementById('mem-msg');
	var first = null, second = null, locked = false, moves = 0, found = 0;

	function shuffle(list) {
		for (var i = list.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var t = list[i]; list[i] = list[j]; list[j] = t;
		}
		return list;
	}
	function updateStats() {
		movesEl.textContent = moves;
		pairsEl.textContent = found + '/' + PAIRS.length;
		bestEl.textContent = store.get('jep-memory-best') || '–';
	}
	function faceDown(tile) {
		tile.classList.remove('is-up');
		tile.setAttribute('aria-label', 'Face-down card');
	}
	function newGame() {
		first = second = null;
		locked = false;
		moves = 0;
		found = 0;
		msgEl.textContent = 'Flip two cards to find a matching pair.';
		msgEl.classList.remove('is-win');
		board.innerHTML = '';
		shuffle(PAIRS.concat(PAIRS)).forEach(function (p) {
			var red = p.suit === '♥' || p.suit === '♦';
			var tile = document.createElement('button');
			tile.type = 'button';
			tile.className = 'tile';
			tile.setAttribute('data-name', p.name);
			tile.setAttribute('aria-label', 'Face-down card');
			tile.innerHTML =
				'<span class="tile-inner">' +
					'<span class="tile-face tile-back" aria-hidden="true">JE</span>' +
					'<span class="tile-face tile-front" aria-hidden="true">' +
						'<span class="tile-suit' + (red ? ' suit-red' : '') + '">' + p.suit + '</span>' +
						'<span>' + p.name.replace('&', '&amp;') + '</span>' +
					'</span>' +
				'</span>';
			tile.addEventListener('click', function () { flip(tile); });
			board.appendChild(tile);
		});
		updateStats();
	}
	function flip(tile) {
		if (locked || tile === first || tile.classList.contains('is-matched')) return;
		tile.classList.add('is-up');
		tile.setAttribute('aria-label', tile.getAttribute('data-name') + ', face up');
		if (!first) { first = tile; return; }
		second = tile;
		moves++;
		if (first.getAttribute('data-name') === second.getAttribute('data-name')) {
			first.classList.add('is-matched');
			second.classList.add('is-matched');
			found++;
			msgEl.textContent = 'Matched ' + tile.getAttribute('data-name') + '.';
			first = second = null;
			if (found === PAIRS.length) win();
		} else {
			locked = true;
			msgEl.textContent = 'Not a pair. Try again.';
			var a = first, b = second;
			setTimeout(function () {
				faceDown(a);
				faceDown(b);
				first = second = null;
				locked = false;
			}, 850);
		}
		updateStats();
	}
	function win() {
		var best = parseInt(store.get('jep-memory-best') || '0', 10);
		var record = !best || moves < best;
		if (record) store.set('jep-memory-best', String(moves));
		msgEl.textContent = 'All ' + PAIRS.length + ' pairs matched in ' + moves + ' moves.' + (record ? ' New best.' : '');
		msgEl.classList.add('is-win');
	}
	document.getElementById('mem-new').addEventListener('click', newGame);
	newGame();
})();
