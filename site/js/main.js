var nww_main = new (function () {
    let Q = new Worker('/js/worker.min.js');
    let ep = 'https://kva.keva.one/';
    // let ep = 'http://127.0.0.1:9999/';

    let bc_general_update = 0;
    let bc_info_update = 0;
    let market_update = 0;
    let bc_news_update = 0;
    let bc_recent_blocks_update = 0;
    let bc_recent_transactions_update = 0;
    let market_display_filter = 'all';

    let stats_tops_chart = undefined;

    let _isections = ["address_section", "explorer_info", "explorer_stats", "explorer_browser", "market_section", "explorer_section", "namespace_section", "main_section", "search_section", "error_section", "about_section"];
    // let _ibsections = ["explorer_info", "explorer_stats", "market_section", "explorer_section", "namespace_section", "main_section", "search_section", "about_section"];

    function nww_main() {
        check_state();

        Q.onmessage = function (e) {
            // console.log('Message received from worker', e['data']);
            if (e['data'][0]['call'] === 'get_supply') {
                return ui_update_supply(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_block') {
                return ui_update_block(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_recent_blocks') {
                return ui_update_recent_blocks(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_recent_transactions') {
                return ui_update_recent_transactions(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'rpc_get_raw_mempool') {
                return ui_update_mempool(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_transaction') {
                return ui_update_transaction(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_address') {
                return ui_update_address(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_search') {
                return ui_update_search(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'rpc_get_mempool_entry') {
                return ui_update_mempool_entry(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_shortcode') {
                return ui_update_namespace_view(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_namespace') {
                return ui_update_namespace_view(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_nft_auctions') {
                return ui_update_market_view(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_stats_tops') {
                return ui_update_stats_tops(e['data'][1]);
            }
            // else if (e['data'][0]['call'] === 'get_info') {
            else if (e['data'][0]['call'] === 'README.md') {
                return ui_update_info(e['data'][1]);
            };
        };
        // get_supply();
        // window.setInterval(get_supply, 30000);
        window.onpopstate = function () {
            check_state();
        };
    };

    function check_state() {
        let _path = window.location.pathname;
        let _d = new Date().getTime();

        if (_path.startsWith("/info")) {
            if (bc_info_update < _d - 3000) {
                ui_clear_info();
                get_info('');
                get_supply();
                bc_info_update = _d;
            };
            document.title = "Keva.One - Kevacoin Info";
            isection_toggle("explorer_section", _isections);
            section_toggle("explorer_info", false);
        }
        else if (_path.startsWith("/stats")) {
            document.title = "Keva.One - Kevacoin Stats";
            // ui_clear_stats();
            chart_section_toggle('tops_balance');
            isection_toggle("explorer_section", _isections);
            section_toggle("explorer_stats", false);
        }
        else if (_path.startsWith("/explorer")) {
            document.title = "Keva.One - Kevacoin Explorer";
            isection_toggle("explorer_section", _isections);
            section_toggle("explorer_browser", false);
            if (_path === "/explorer/recent-blocks") {
                document.title = "Keva.One - Kevacoin Recent Blocks";
                ui_clear_recent_blocks();
                get_recent_blocks('');
                exp_section_toggle("explorer_recent_blocks", false);
            }
            else if (_path === "/explorer/recent-transactions") {
                document.title = "Keva.One - Kevacoin Recent Transactions";
                ui_clear_recent_transactions();
                get_recent_transactions('');
                exp_section_toggle("explorer_recent_transactions", false);
            }
            else if (_path === "/explorer/mempool") {
                document.title = "Keva.One - Kevacoin Mempool";
                ui_clear_mempool();
                get_raw_mempool('');
                exp_section_toggle("explorer_mempool", false);
            }
            else if (_path.startsWith("/explorer/block/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Block " + _p[_p.length - 1];
                ui_clear_block();
                get_block(_p[_p.length - 1]);
                exp_section_toggle("explorer_block", false);
            }
            else if (_path.startsWith("/explorer/transaction/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Transaction " + _p[_p.length - 1];
                ui_clear_transaction();
                get_transaction(_p[_p.length - 1]);
                exp_section_toggle("explorer_transaction", false);
            }
            else if (_path.startsWith("/explorer/address/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Address " + _p[_p.length - 1];
                ui_clear_address();
                get_address(_p[_p.length - 1]);
                isection_toggle("address_section", _isections);
            }
            else if (_path.startsWith("/explorer/mempool/entry")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Mempool Entry " + _p[_p.length - 1];
                ui_clear_mempool_entry();
                get_mempool_entry(_p[_p.length - 1]);
                exp_section_toggle("explorer_mempool_entry", false);
            }
            else if (_path.startsWith("/explorer/search")) {
                document.title = "Keva.One - Kevacoin Search";
                ui_clear_search();
                isection_toggle("explorer_section", _isections);
            }
            else {
                ui_clear_recent_blocks();
                get_recent_blocks('');
            };
        }
        else if (_path.startsWith("/market")) {
            document.title = "Keva.One - Kevacoin Auctions";
            if (market_update < _d - 30000) {
                ui_clear_market_view();
                get_nft_auctions('');
                market_update = _d;
            };
            isection_toggle("market_section", _isections);
        }
        else if (_path.startsWith("/search")) {
            document.title = "Keva.One - Search";
            isection_toggle("search_section", _isections);
        }
        else if (_path.startsWith("/error")) {
            document.title = "Keva.One - Error";
            isection_toggle("error_section", _isections);
        }
        else if (_path.startsWith("/about")) {
            document.title = "Keva.One - About";
            isection_toggle("about_section", _isections);
        }
        else if (_path === "/") {
            document.title = "Keva.One";
            isection_toggle("main_section", _isections);
        }
        else {
            let _p = _path.split("/");

            if (_p[_p.length - 1].length > parseInt(_p[_p.length - 1][0], 10) + 1) {
                document.title = "Keva.One - Kevacoin Shortcode " + _p[_p.length - 1];
                ui_clear_namespace_view();
                get_shortcode(_p[_p.length - 1]);
                isection_toggle("namespace_section", _isections);
            }
            else if (_p[_p.length - 1].startsWith('N') & _p[_p.length - 1].length === 34) {
                document.title = "Keva.One - Kevacoin Namespace " + _p[_p.length - 1];
                ui_clear_namespace_view();
                get_namespace(_p[_p.length - 1]);
                isection_toggle("namespace_section", _isections);
            }
            else {
                document.title = "Keva.One - Error";
                let _error_msg = gei('error_msg');
                _error_msg.innerText = 'Nothing there!';
                section_toggle('error_section', false);
            };
        };
    };

    myFunction = function (id) {
        var x = gei(id);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
            x.previousElementSibling.className += " w3-theme-d1";
        } else {
            x.className = x.className.replace("w3-show", "");
            x.previousElementSibling.className =
                x.previousElementSibling.className.replace(" w3-theme-d1", "");
        };
    };

    isection_toggle = function (id, sections) {
        for (let i = 0; i < sections.length; i++) {
            let section = gei(sections[i]);
            if (sections[i] == id) {
                if (section.className.indexOf("w3-show") == -1) {
                    section.className += " w3-show";
                }
            } else {
                if (section.className.indexOf("w3-show") != -1) {
                    section.className = section.className.replace(" w3-show", "");
                };
            };
        };
    };

    section_toggle = function (id, cs = true) {
        let sections = ["explorer_info", "explorer_stats", "explorer_browser", "market_section", "main_section", "search_section", "error_section", "about_section"];
        isection_toggle(id, sections);
        if (cs) {
            if (id === "explorer_info") {
                window.history.pushState({}, '', '/info');
            }
            else if (id === "explorer_stats") {
                window.history.pushState({}, '', '/stats');
            }
            else if (id === "explorer_browser") {
                let _path = window.location.pathname;
                if (!_path.startsWith("/explorer/block/") &
                    !_path.startsWith("/explorer/recent-blocks") &
                    !_path.startsWith("/explorer/recent-transactions") &
                    !_path.startsWith("/explorer/transaction/") &
                    !_path.startsWith("/explorer/address/") &
                    !_path.startsWith("/explorer/mempool/entry/")) {

                    window.history.replaceState(null, document.title, "/explorer");
                };
            }
            else if (id === "market_section") {
                window.history.pushState({}, '', '/market');
            }
            else if (id === "main_section") {
                window.history.pushState({}, '', '/');
            }
            else if (id === "about_section") {
                window.history.pushState({}, '', '/about');
            }
            else if (id === "search_section") {
                window.history.pushState({}, '', '/search');
            }
            else if (id === "error_section") {
                window.history.pushState({}, '', '/error');
            };


            check_state();
        }
        else {
            if (id === "explorer_info") {
                // window.history.pushState({}, '', '/info');
                window.history.replaceState(null, document.title, "/info");
            }
            else if (id === "explorer_stats") {
                // window.history.pushState({}, '', '/stats');
                window.history.replaceState(null, document.title, "/stats");
            }
            else if (id === "explorer_browser") {
                let _path = window.location.pathname;
                if (!_path.startsWith("/explorer/block/") &
                    !_path.startsWith("/explorer/recent-blocks") &
                    !_path.startsWith("/explorer/recent-transactions") &
                    !_path.startsWith("/explorer/transaction/") &
                    !_path.startsWith("/explorer/address/") &
                    !_path.startsWith("/explorer/mempool/entry/")) {

                    window.history.replaceState(null, document.title, "/explorer");
                };
            }
            else if (id === "market_section") {
                // window.history.pushState({}, '', '/market');
                window.history.replaceState(null, document.title, "/market");
            }
            else if (id === "main_section") {
                // window.history.pushState({}, '', '/');
                window.history.replaceState(null, document.title, "/");
            }
            else if (id === "about_section") {
                // window.history.pushState({}, '', '/about');
                window.history.replaceState(null, document.title, "/about");
            }
            else if (id === "search_section") {
                // window.history.pushState({}, '', '/search');
                window.history.replaceState(null, document.title, "/search");
            }
            else if (id === "error_section") {
                // window.history.pushState({}, '', '/error');
                window.history.replaceState(null, document.title, "/error");
            };
        };
    };

    exp_section_toggle = function (id, cs = true) {
        let sections = ["explorer_recent_blocks", "explorer_recent_transactions", "explorer_mempool", "explorer_block", "explorer_transaction", "explorer_mempool_entry"];
        isection_toggle(id, sections);
        if (cs) {
            if (id === "explorer_recent_blocks") {
                window.history.pushState({}, '', '/explorer/recent-blocks');
            }
            else if (id === "explorer_recent_transactions") {
                window.history.pushState({}, '', '/explorer/recent-transactions');
            }
            else if (id === "explorer_mempool") {
                window.history.pushState({}, '', '/explorer/mempool');
            };
            check_state();
        }
        else {
            if (id === "explorer_recent_blocks") {
                window.history.replaceState(null, document.title, "/explorer/recent-blocks");
            }
            else if (id === "explorer_recent_transactions") {
                window.history.replaceState(null, document.title, "/explorer/recent-transactions");
            }
            else if (id === "explorer_mempool") {
                window.history.replaceState(null, document.title, "/explorer/mempool");
            };
        };
    };

    get_supply = function () {
        let _path = window.location.pathname;
        if (_path === "/" || _path.startsWith("/info") || _path.startsWith("/stats") || _path.startsWith("/explorer")) {
            let _pl = {};
            _pl['endPoint'] = ep;
            _pl['call'] = 'get_supply';
            _pl['type'] = 'GET';
            Q.postMessage(_pl);
        };
    };

    get_block = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;

        if (e.length === 64) {
            _pl['call'] = 'get_block';
            _pl['call_data'] = e;
        } else {
            _pl['call'] = 'get_block';
            _pl['call_data'] = parseInt(e, 10);
        };

        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_transaction = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_transaction';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_address = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_address';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_namespace = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_namespace';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_shortcode = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_shortcode';
        _pl['call_data'] = parseInt(e, 10);
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_nft_auctions = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_nft_auctions';
        // _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_info = function (e) {
        let _pl = {};
        _pl['endPoint'] = 'https://raw.githubusercontent.com/kevacoin-project/kevacoin/master/';
        _pl['call'] = 'README.md';
        // _pl['endPoint'] = ep;
        // _pl['call'] = 'get_info';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_recent_blocks = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_recent_blocks';
        _pl['call_data'] = '?page_size=150';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_recent_transactions = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_recent_transactions';
        _pl['call_data'] = '?page_size=150';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_raw_mempool = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'rpc_get_raw_mempool';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_mempool_entry = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'rpc_get_mempool_entry';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_search = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_search';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    get_stats_tops = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_stats_tops';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    ui_clear_recent_blocks = function () {
        isection_toggle('recent_blocks_loading', ['recent_blocks_loading', 'recent_blocks_main']);
        let _uibexp_rb = gei('uibexp_rb');
        clear_table(_uibexp_rb);
    };

    ui_update_recent_blocks = function (e) {
        let _uibexp_rb = gei('uibexp_rb');

        for (result in e[1]['page_results']) {
            let _bh_lnk = ce('span');
            _bh_lnk.innerText = e[1]['page_results'][result][0];
            // _bh_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _bh_lnk.onclick = function () {
            //     section_link('block', _bh_lnk.innerText);
            // };
            _bh_lnk.title = 'View block';
            csl(_bh_lnk, 'block', _bh_lnk.innerText);
            let _b_lnk = ce('span');
            _b_lnk.innerText = e[1]['page_results'][result][1];
            // _b_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _b_lnk.onclick = function () {
            //     section_link('block', _b_lnk.innerText);
            // };
            _b_lnk.title = 'View block';
            csl(_b_lnk, 'block', _b_lnk.innerText);
            let _r = [e[1]['page_results'][result][2].slice(0, -12), _bh_lnk, _b_lnk, e[1]['page_results'][result][3], e[1]['page_results'][result][4]];
            add_row(_uibexp_rb, _r);
        };
        isection_toggle('recent_blocks_main', ['recent_blocks_loading', 'recent_blocks_main']);
    };

    ui_clear_recent_transactions = function () {
        isection_toggle('recent_transactions_loading', ['recent_transactions_loading', 'recent_transactions_main']);
        let _uibexp_rt = gei('uibexp_rt');
        clear_table(_uibexp_rt);
    };

    ui_update_recent_transactions = function (e) {
        let _uibexp_rt = gei('uibexp_rt');

        for (result in e[1]['page_results']) {
            let _tx_lnk = ce('span');
            let tx = e[1]['page_results'][result];
            _tx_lnk.innerText = tx[1];
            // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tx_lnk.onclick = function () {
            //     section_link('transaction', _tx_lnk.innerText);
            // };
            _tx_lnk.title = 'View transaction';
            csl(_tx_lnk, 'transaction', _tx_lnk.innerText);
            let _b_lnk = ce('span');
            _b_lnk.innerText = tx[0];
            // _b_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _b_lnk.onclick = function () {
            //     section_link('block', _b_lnk.innerText);
            // };
            _b_lnk.title = 'View block';
            csl(_b_lnk, 'block', _b_lnk.innerText);
            let _r = [tx[2].slice(0, -12), _b_lnk, _tx_lnk, tx[3], tx[4], tx[5]];
            add_row(_uibexp_rt, _r);
        };
        isection_toggle('recent_transactions_main', ['recent_transactions_loading', 'recent_transactions_main']);
    };

    ui_clear_mempool = function () {
        isection_toggle('mempool_loading', ['mempool_loading', 'mempool_main']);
        let _uibexp_rm = gei('uibexp_rm');
        clear_table(_uibexp_rm);
    };

    ui_update_mempool = function (e) {
        let _uibexp_rm = gei('uibexp_rm');
        if (typeof e == 'object') {
            for (result in e) {
                let _tx_lnk = ce('span');
                _tx_lnk.innerText = e[result];
                // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _tx_lnk.onclick = function () {
                //     section_link('mempool', _tx_lnk.innerText);
                // };
                _tx_lnk.title = 'View mempool transaction';
                csl(_tx_lnk, 'mempool', _tx_lnk.innerText);
                let _r = [_tx_lnk];
                add_row(_uibexp_rm, _r);
            };
        }
        else {
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = e;
            // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tx_lnk.onclick = function () {
            //     section_link('mempool', _tx_lnk.innerText);
            // };
            _tx_lnk.title = 'View mempool transaction';
            csl(_tx_lnk, 'mempool', _tx_lnk.innerText);
            let _r = [_tx_lnk];
            add_row(_uibexp_rm, _r);
        };
        isection_toggle('mempool_main', ['mempool_loading', 'mempool_main']);
    };

    ui_update_supply = function (e) {
        let _height = gei('uibs_height');
        let _supply = gei('uibs_supply');
        let _fees = gei('uibs_fees');
        let _uibs_genreward = gei('uibs_genreward');
        let _uibs_diff = gei('uibs_diff');
        let _uibs_nethash = gei('uibs_nethash');

        _height.innerText = e['block_height'];
        _supply.innerText = e['coin_supply'];
        _fees.innerText = e['fees_payed'];
        _uibs_genreward.innerText = e['genisis_reward'];
        _uibs_diff.innerText = rounder(e['difficulty'], '3');
        _uibs_nethash.innerText = rounder(e['networkhashps'], '3');
    };

    ui_clear_search = function () {
        let _search_results = gei('search_results');
        while (_search_results.firstChild) {
            _search_results.removeChild(_search_results.firstChild);
        };
    };

    ui_update_search = function (e) {
        let _search_results = gei('search_results');
        let _search_result_count = gei('search_result_count');
        let _count = 0;

        if ('address' in e) {
            let _address_spacer = gei('result_address_spacer');
            let _aspc = _address_spacer.cloneNode(true);
            _aspc.removeAttribute('id');
            let _aspc_name = qsgei(_aspc, '#result_address_name');
            let _aspc_bal = qsgei(_aspc, '#result_address_balance');

            let _addr = e['address'][0];
            _aspc_name.innerText = _addr;
            // _aspc_name.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _aspc_name.onclick = function () {
            //     section_link('address', _addr);
            // };
            _aspc_name.title = 'View address';
            csl(_aspc_name, 'address', _addr);
            _aspc_bal.innerText = e['address'][1];
            _search_results.appendChild(_aspc);
            _count += 1;
        };

        if ('block' in e) {
            let _block_spacer = gei('result_block_spacer');
            let _bspc = _block_spacer.cloneNode(true);
            _bspc.removeAttribute('id');
            let _bspc_time = qsgei(_bspc, '#result_block_time');
            let _bspc_height = qsgei(_bspc, '#result_block_height');
            let _bspc_hash = qsgei(_bspc, '#result_block_hash');

            _bspc_time.innerText = e['block'][1];
            let _bb = e['block'][0];
            _bspc_height.innerText = _bb;
            // _bspc_height.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _bspc_height.onclick = function () {
            //     section_link('block', _bb);
            // };
            _bspc_height.title = 'View block';
            csl(_bspc_height, 'block', _bb);
            let _bhash = e['block'][2];
            _bspc_hash.innerText = _bhash;
            // _bspc_hash.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _bspc_hash.onclick = function () {
            //     section_link('block', _bhash);
            // };
            _bspc_hash.title = 'View block';
            csl(_bspc_hash, 'block', _bhash);
            _search_results.appendChild(_bspc);
            _count += 1;
        };

        if ('tx' in e) {
            let _tx_spacer = gei('result_transaction_spacer');
            let _tspc = _tx_spacer.cloneNode(true);
            _tspc.removeAttribute('id');
            let _tspc_time = qsgei(_tspc, '#result_transaction_time');
            let _tspc_height = qsgei(_tspc, '#result_transaction_block');
            let _tspc_hash = qsgei(_tspc, '#result_transaction_hash');

            let _tb = e['tx'][0];
            _tspc_time.innerText = e['tx'][1];
            _tspc_height.innerText = _tb;
            // _tspc_height.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tspc_height.onclick = function () {
            //     section_link('block', _tb);
            // };
            _tspc_height.title = 'View block';
            csl(_tspc_height, 'block', _tb);
            let _hash = e['tx'][2]
            _tspc_hash.innerText = _hash;
            // _tspc_hash.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tspc_hash.onclick = function () {
            //     section_link('transaction', _hash);
            // };
            _tspc_hash.title = 'View transaction';
            csl(_tspc_hash, 'transaction', _hash);
            _search_results.appendChild(_tspc);
            _count += 1;
        };

        if ('namespace' in e) {
            let _namespace_spacer = gei('result_namespace_spacer');
            let _nspc = _namespace_spacer.cloneNode(true);
            _nspc.removeAttribute('id');
            let _nspc_nsid = qsgei(_nspc, '#result_namespace_nsid');
            let _nspc_shortcode = qsgei(_nspc, '#result_namespace_shortcode');

            _nspc_nsid.innerText = e['namespace'][0];
            _nspc_shortcode.innerText = e['namespace'][1] + e['namespace'][2];

            _search_results.appendChild(_nspc);
            _count += 1;
        };

        if ('shortcode' in e) {
            let _namespace_spacer = gei('result_namespace_spacer');
            let _nspc = _namespace_spacer.cloneNode(true);
            _nspc.removeAttribute('id');
            let _nspc_nsid = qsgei(_nspc, '#result_namespace_nsid');
            let _nspc_shortcode = qsgei(_nspc, '#result_namespace_shortcode');


            let _nsid = e['shortcode'][0];
            _nspc_nsid.innerText = _nsid;
            // _nspc_nsid.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _nspc_nsid.onclick = function () {
            //     section_link('shortcode', _nsid);
            // };
            _nspc_nsid.title = 'View namespace';
            csl(_nspc_nsid, 'shortcode', _nsid);
            let _sc = e['shortcode'][1];
            _nspc_shortcode.innerText = _sc + ' ' + e['shortcode'][2];
            // _nspc_shortcode.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _nspc_shortcode.onclick = function () {
            //     section_link('shortcode', _sc);
            // };
            _nspc_shortcode.title = 'View namespace';
            csl(_nspc_shortcode, 'shortcode', _sc);

            _nspc_nsid.innerText = e['shortcode'][0];
            _nspc_shortcode.innerText = e['shortcode'][1] + e['shortcode'][2];

            _search_results.appendChild(_nspc);
            _count += 1;
        };

        if ('content' in e) {
            let _content_section_spacer = gei('result_namespace_content_section');
            let _content_spacer = gei('result_namespace_content_spacer');
            let _content_spacer_clone = _content_spacer.cloneNode(true);
            _content_spacer_clone.removeAttribute('id');
            let _content_list = qsgei(_content_spacer_clone, '#result_namespace_content_list');

            // _content_list.removeAttribute('id');
            for (result in e['content']) {
                let _ncspc = _content_section_spacer.cloneNode(true);
                _ncspc.removeAttribute('id');
                let _ncspc_time = qsgei(_ncspc, '#result_namespace_content_time');
                let _ncspc_nsid = qsgei(_ncspc, '#result_namespace_content_nsid');
                let _ncspc_shortcode = qsgei(_ncspc, '#result_namespace_content_shortcode');
                let _ncspc_key = qsgei(_ncspc, '#result_namespace_content_key');
                let _ncspc_value = qsgei(_ncspc, '#result_namespace_content_value');

                _ncspc_time.innerText = e['content'][result][0];
                let _ncsid = e['content'][result][2];
                _ncspc_nsid.innerText = _ncsid;
                // _ncspc_nsid.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _ncspc_nsid.onclick = function () {
                //     section_link('shortcode', _ncsid);
                // };
                _ncspc_nsid.title = 'View namespace';
                csl(_ncspc_nsid, 'shortcode', _ncsid);
                let _csc = e['content'][result][3];
                _ncspc_shortcode.innerText = _csc + ' ' + e['content'][result][4]
                // _ncspc_shortcode.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _ncspc_shortcode.onclick = function () {
                //     section_link('shortcode', _csc);
                // };
                _ncspc_shortcode.title = 'View namespace';
                csl(_ncspc_shortcode, 'shortcode', _csc);
                _ncspc_key.innerText = e['content'][result][5];
                _ncspc_value.innerText = e['content'][result][6];

                _content_list.appendChild(_ncspc);
                _count += 1;
            };
            _search_results.appendChild(_content_spacer_clone);
        };
        _search_result_count.innerText = _count;
        isection_toggle('search_results_info', ['search_loading', 'search_results_info']);
    };

    ui_clear_block = function () {
        isection_toggle('block_loading', ['block_loading', 'block_main']);
        let _height = gei('uibexp_bheight');
        let _hash = gei('uibexp_bhash');
        let _version = gei('uibexp_bversion');
        let _phash = gei('uibexp_bphash');
        let _merkle = gei('uibexp_bmerkle');
        let _time = gei('uibexp_btime');
        let _bits = gei('uibexp_bbits');
        let _nonce = gei('uibexp_bnonce');
        let _extra = gei('uibexp_bextra');
        let _bt = gei('uibexp_bt');
        let _uibexp_betxc = gei('uibexp_betxc');

        clear_table(_bt);

        _height.innerText = null;
        _hash.innerText = null;
        _version.innerText = null;
        _phash.innerText = null;
        _phash.onclick = null;
        _merkle.innerText = null;
        _time.innerText = null;
        _bits.innerText = null;
        _nonce.innerText = null;
        _extra.innerText = null;
        _uibexp_betxc.innerText = null;
    };

    ui_update_block = function (e) {
        let _height = gei('uibexp_bheight');
        let _hash = gei('uibexp_bhash');
        let _version = gei('uibexp_bversion');
        let _phash = gei('uibexp_bphash');
        let _merkle = gei('uibexp_bmerkle');
        let _time = gei('uibexp_btime');
        let _bits = gei('uibexp_bbits');
        let _nonce = gei('uibexp_bnonce');
        let _extra = gei('uibexp_bextra');
        let _bt = gei('uibexp_bt');
        let _uibexp_betxc = gei('uibexp_betxc');

        _height.innerText = e['height'];
        _hash.innerText = e['blockhash'];
        _version.innerText = e['header']['version'];
        _phash.innerText = e['header']['prev_hash'];
        // _phash.onclick = function () {
        //     section_link('block', e['header']['prev_hash']);
        // };
        _phash.title = 'View block';
        csl(_phash, 'block', e['header']['prev_hash']);
        _merkle.innerText = e['header']['merkle'];
        _time.innerText = e['header']['time'].slice(0, -12);
        _bits.innerText = e['header']['bits'];
        _nonce.innerText = e['header']['nonce'];
        _extra.innerText = e['header']['extra'];
        _uibexp_betxc.innerText = e['transactions'].length;

        for (result in e['transactions']) {
            let r = e['transactions'][result];
            let sats = 0;

            for (res in r['vout']) {
                sats += r['vout'][res]['value'];
            };
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = r['txid'];
            // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tx_lnk.onclick = function () {
            //     section_link('transaction', r['txid']);
            // };
            _tx_lnk.title = 'View transaction';
            csl(_tx_lnk, 'transaction', r['txid']);
            add_row(_bt, [_tx_lnk, r['vin'].length, r['vout'].length, sats]);
        };
        isection_toggle('block_main', ['block_loading', 'block_main']);
    };

    ui_clear_transaction = function () {
        isection_toggle('transaction_loading', ['transaction_loading', 'transaction_main']);
        let _id = gei('uibexp_ti');
        let _hash = gei('uibexp_th');
        let _locktime = gei('uibexp_tl');
        let _version = gei('uibexp_tv');
        let _flag = gei('uibexp_tfl');
        let _size = gei('uibexp_ts');
        let _vsize = gei('uibexp_tvs');
        let _bh = gei('uibexp_tbh');
        let _vin = gei('uibexp_tin');
        let _vout = gei('uibexp_tout');
        let _wit = gei('uibexp_twit');
        let _uibexp_txinputs = gei('uibexp_txinputs');
        let _uibexp_txoutputs = gei('uibexp_txoutputs');
        let _uibexp_txwit = gei('uibexp_txwit');
        clear_table(_vin);
        clear_table(_vout);
        clear_table(_wit);

        _id.innerText = null;
        uibexp_time.innerText = null;
        _hash.innerText = null;
        _locktime.innerText = null;
        _version.innerText = null;
        _flag.innerText = null;
        _size.innerText = null;
        _vsize.innerText = null;
        _bh.innerText = null;
        _bh.style.cssText = '';
        _bh.onclick = null;
        _uibexp_txinputs.innerText = null;
        _uibexp_txoutputs.innerText = null;
        _uibexp_txwit.innerText = null;
    };

    ui_update_transaction = function (e) {
        let _id = gei('uibexp_ti');
        let _uibexp_time = gei('uibexp_time');
        let _hash = gei('uibexp_th');
        let _locktime = gei('uibexp_tl');
        let _version = gei('uibexp_tv');
        let _flag = gei('uibexp_tfl');
        let _size = gei('uibexp_ts');
        let _vsize = gei('uibexp_tvs');
        let _bh = gei('uibexp_tbh');
        let _vin = gei('uibexp_tin');
        let _vout = gei('uibexp_tout');
        let _wit = gei('uibexp_twit');
        let _uibexp_txinputs = gei('uibexp_txinputs');
        let _uibexp_txoutputs = gei('uibexp_txoutputs');
        let _uibexp_txwit = gei('uibexp_txwit');

        _id.innerText = e['txid'];
        _uibexp_time.innerText = e['time'].slice(0, -12);
        _hash.innerText = e['hash'];
        _locktime.innerText = e['locktime'];
        _version.innerText = e['version'];
        _flag.innerText = e['flag'];
        _size.innerText = e['size'];
        _vsize.innerText = e['vsize'];
        _bh.innerText = e['block'];
        // _bh.style.cssText = 'cursor: pointer; text-decoration: underline;';
        // _bh.onclick = function () {
        //     section_link('block', _bh.innerText);
        // };
        _bh.title = 'View block';
        csl(_bh, 'block', _bh.innerText);

        _uibexp_txinputs.innerText = e['vin'].length;
        for (result in e['vin']) {
            let _piv = e['vin'][result];
            if (_piv['address'] !== 'coinbase') {
                let _tx_lnk = ce('span');
                let _tx = _piv['txid'];
                let _paddr_lnk = ce('span');
                let _paddr = _piv['address'];
                _paddr_lnk.innerText = _paddr;
                // _paddr_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _paddr_lnk.onclick = function () {
                //     section_link('address', _paddr);
                // };
                _paddr_lnk.title = 'View address';
                csl(_paddr_lnk, 'address', _paddr);
                _piv['address'] = _paddr_lnk;
                _tx_lnk.innerText = _piv['txid'];
                // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _tx_lnk.onclick = function () {
                //     section_link('transaction', _tx);
                // };
                _tx_lnk.title = 'View transaction';
                csl(_tx_lnk, 'transaction', _tx);
                _piv['txid'] = _tx_lnk;
            };
            add_row(_vin, [_piv['value'], _piv['address'], _piv['txid'], _piv['vout'], _piv['sequence']]);
        };
        _uibexp_txoutputs.innerText = e['vout'].length;
        for (result in e['vout']) {
            let _pov = e['vout'][result]
            let _addr_lnk = ce('span');
            if (_pov['address'] !== '') {
                let _addr = _pov['address'];
                _addr_lnk.innerText = _addr;
                // _addr_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // _addr_lnk.onclick = function () {
                //     section_link('address', _addr);
                // };
                _addr_lnk.title = 'View address';
                csl(_addr_lnk, 'address', _addr);
                _pov['address'] = _addr_lnk;
            };
            add_row(_vout, [_pov['value'], _addr_lnk, _pov['script_pubkey']]);
        };
        _uibexp_txwit.innerText = e['witness'].length;
        for (result in e['witness']) {
            add_row(_wit, e['witness'][result]);
        };
        isection_toggle('transaction_main', ['transaction_loading', 'transaction_main']);
    };

    ui_clear_address = function () {
        isection_toggle('address_loading', ['address_loading', 'address_main']);
        let _received = gei('uibexp_ar');
        let _sent = gei('uibexp_as');
        let _balance = gei('uibexp_ab');
        let _total_results = gei('uibexp_att');
        let _recent_tx = gei('uibexp_art');
        let _uibexp_ai = gei('uibexp_ai');
        clear_table(_recent_tx);
        _uibexp_ai.innerText = null;
        _received.innerText = null;
        _sent.innerText = null;
        _balance.innerText = null;
        _total_results.innerText = null;
    };

    ui_update_address = function (e) {
        let _received = gei('uibexp_ar');
        let _sent = gei('uibexp_as');
        let _balance = gei('uibexp_ab');
        let _total_results = gei('uibexp_att');
        let _recent_tx = gei('uibexp_art');
        let _uibexp_ai = gei('uibexp_ai');

        _uibexp_ai.innerText = e[0]['address'];
        _received.innerText = e[0]['received'];
        _sent.innerText = e[0]['sent'];
        _balance.innerText = e[0]['balance'];
        _total_results.innerText = e[1]['total_results'];

        for (result in e[1]['page_results']) {
            let r = e[1]['page_results'][result];
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = r['txid'].split(':')[0];
            // _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _tx_lnk.onclick = function () {
            //     section_link('transaction', _tx_lnk.innerText);
            // };
            _tx_lnk.title = 'View transaction';
            csl(_tx_lnk, 'transaction', _tx_lnk.innerText);
            let _b_lnk = ce('span');
            _b_lnk.innerText = r['block'];
            // _b_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // _b_lnk.onclick = function () {
            //     section_link('block', _b_lnk.innerText);
            // };
            _b_lnk.title = 'View block';
            csl(_b_lnk, 'block', _b_lnk.innerText);
            add_row(_recent_tx, [r['time'].slice(0, -12), _b_lnk, _tx_lnk, r['value'], r['direction']]);
        };
        isection_toggle('address_main', ['address_loading', 'address_main']);
    };

    ui_clear_mempool_entry = function () {
        isection_toggle('mempool_entry_loading', ['mempool_entry_loading', 'mempool_entry_main']);
        let _mat = gei('uibexp_mat');
        let _mdt = gei('uibexp_mdt');
        clear_table(_mat);
        clear_table(_mdt);
        let _m = gei('uibexp_mti');
        let ancestorcount = gei('uibexp_mac');
        let ancestorfees = gei('uibexp_maf');
        let ancestorsize = gei('uibexp_mas');
        let depends = gei('uibexp_md');
        let descendantcount = gei('uibexp_mdc');
        let descendantfees = gei('uibexp_mdf');
        let descendantsize = gei('uibexp_mds');
        let fee = gei('uibexp_mfee');
        let height = gei('uibexp_mh');
        let modifiedfee = gei('uibexp_mf');
        let size = gei('uibexp_ms');
        let time = gei('uibexp_mtime');
        let wtxid = gei('uibexp_mwtx');

        _m.innerText = null;
        ancestorcount.innerText = null;
        ancestorfees.innerText = null;
        ancestorsize.innerText = null;
        depends.innerText = null;
        descendantcount.innerText = null;
        descendantfees.innerText = null;
        descendantsize.innerText = null;
        fee.innerText = null;
        height.innerText = null;
        modifiedfee.innerText = null;
        size.innerText = null;
        time.innerText = null;
        wtxid.innerText = null;
    };

    ui_update_mempool_entry = function (e) {
        let _mat = gei('uibexp_mat');
        let _mdt = gei('uibexp_mdt');
        let _m = gei('uibexp_mti');
        let ancestorcount = gei('uibexp_mac');
        let ancestorfees = gei('uibexp_maf');
        let ancestorsize = gei('uibexp_mas');
        let depends = gei('uibexp_md');
        let descendantcount = gei('uibexp_mdc');
        let descendantfees = gei('uibexp_mdf');
        let descendantsize = gei('uibexp_mds');
        let fee = gei('uibexp_mfee');
        let height = gei('uibexp_mh');
        let modifiedfee = gei('uibexp_mf');
        let size = gei('uibexp_ms');
        let time = gei('uibexp_mtime');
        let wtxid = gei('uibexp_mwtx');
        let _path = window.location.pathname;
        let _p = _path.split("/");

        _m.innerText = _p[_p.length - 1];
        ancestorcount.innerText = e['ancestorcount'];
        ancestorfees.innerText = e['ancestorfees'];
        ancestorsize.innerText = e['ancestorsize'];
        depends.innerText = e['depends'];
        descendantcount.innerText = e['descendantcount'];
        descendantfees.innerText = e['descendantfees'];
        descendantsize.innerText = e['descendantsize'];
        fee.innerText = e['fee'];
        height.innerText = e['height'];
        modifiedfee.innerText = e['modifiedfee'];
        size.innerText = e['size'];
        time.innerText = e['time'];
        wtxid.innerText = e['wtxid'];
        isection_toggle('mempool_entry_main', ['mempool_entry_loading', 'mempool_entry_main']);
    };

    ui_clear_info = function () {
        isection_toggle('explorer_info_loading', ['explorer_info_loading', 'explorer_info_main']);
        let _received = gei('bexp_inftext');
        _received.innerText = null;
    };

    ui_update_info = function (e) {
        let _received = gei('bexp_inftext');
        _received.innerText = e;
        isection_toggle('explorer_info_main', ['explorer_info_loading', 'explorer_info_main']);
    };

    ui_clear_namespace_view = function () {
        isection_toggle('namespace_loading', ['namespace_loading', 'ns_pro', 'ns_view']);
        let _bexp_nsv = gei('ns_view');
        let nspro_name = gei('nspro_name');
        let nspro_sc = gei('nspro_sc');
        let nspro_nsid = gei('nspro_nsid');
        let nspro_keys = gei('nspro_keys');
        let nspro_owner = gei('nspro_owner');

        while (_bexp_nsv.firstChild) {
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };

        nspro_nsid.innerText = null;
        nspro_nsid.onclick = null;
        nspro_sc.innerText = null;
        nspro_sc.onclick = null;
        nspro_keys.innerText = null;
        nspro_owner.innerText = null;
        nspro_owner.onclick = null;
        nspro_name.innerText = null;
    };

    ui_update_namespace_view = function (e) {
        if (e === 'Invaild Shortcode') {
            let _error_msg = gei('error_msg');
            _error_msg.innerText = e;
            section_toggle('error_section', false);
            return;
        };
        let _bexp_nsv = gei('ns_view');
        let nspro_name = gei('nspro_name');
        let nspro_sc = gei('nspro_sc');
        let nspro_nsid = gei('nspro_nsid');
        let nspro_keys = gei('nspro_keys');
        let nspro_owner = gei('nspro_owner');
        let spacer = ce('div');
        spacer.style.marginTop = '-16px';
        _bexp_nsv.appendChild(spacer);
        e['data'].reverse();

        nspro_nsid.innerText = e['dnsid'];
        // nspro_nsid.onclick = function () {
        //     section_link('shortcode', nspro_nsid.innerText);
        // };
        nspro_nsid.title = 'View namespace';
        csl(nspro_nsid, 'shortcode', nspro_nsid.innerText);
        nspro_sc.innerText = e['root_shortcode'];
        // nspro_sc.onclick = function () {
        //     section_link('shortcode', nspro_sc.innerText);
        // };
        nspro_sc.title = 'View namespace';
        csl(nspro_sc, 'shortcode', nspro_sc.innerText);
        nspro_keys.innerText = e['data'].length;
        nspro_owner.innerText = e['data'][0]['addr'];
        // nspro_owner.onclick = function () {
        //     section_link('address', nspro_owner.innerText);
        // };
        nspro_owner.title = 'View address';
        csl(nspro_owner, 'address', nspro_owner.innerText);
        nspro_name.innerHTML = e['name'];

        function get_ns_section(dtype) {
            if (dtype === 'ns_create') {
                return ['ns_create_section', gei('ns_create_section')];
            }
            else if (dtype === 'delete_key') {
                return ['ns_delete_key_section', gei('ns_delete_key_section')];
            }
            else if (dtype === 'name_update') {
                return ['ns_rename_section', gei('ns_rename_section')];
            }
            else if (dtype === 'nft_auction') {
                return ['ns_auction_section', gei('ns_auction_section')];
            }
            else if (dtype === '') {
                return ['ns_regular_section', gei('ns_regular_section')];
            }
            else if (dtype === 'reply') {
                return ['ns_reply_section', gei('ns_reply_section')];
            }
            else if (dtype === 'repost') {
                return ['ns_repost_section', gei('ns_repost_section')];
            }
            else if (dtype === 'nft_bid') {
                return ['ns_bid_section', gei('ns_bid_section')];
            }
            else if (dtype === 'reward') {
                return ['ns_reward_section', gei('ns_reward_section')];
            };
        };

        for (result in e['data']) {
            let _ns_section = get_ns_section(e['data'][result]['dtype']);
            let x = _ns_section[1].cloneNode(true);
            x.removeAttribute('id');
            let k = qsgei(x, '#' + _ns_section[0] + '_key');
            let t = qsgei(x, '#' + _ns_section[0] + '_time');
            let v = qsgei(x, '#' + _ns_section[0] + '_value');
            let b = qsgei(x, '#' + _ns_section[0] + '_block');
            let bi = qsgei(x, '#' + _ns_section[0] + '_blocki');
            let txid = qsgei(x, '#' + _ns_section[0] + '_txid');
            let replies = qsgei(x, '#' + _ns_section[0] + '_replies');

            k.innerHTML = e['data'][result]['dkey'];
            t.innerText = e['data'][result]['time'].slice(0, -12);

            if (e['data'][result]['dkey'] === 'html') {
                v.innerText = '';
                let ifra = ce('iframe');
                ifra.srcdoc = e['data'][result]['dvalue'];
                ifra.className = 'w3-theme-iframe';
                // ifra.style.cssText = 'width: 200%; height: 200vh; -webkit-transform: scale(.5); transform: scale(.5); -webkit-transform-origin: 0 0; transform-origin: 0 0;';
                v.appendChild(ifra);
            }
            else {
                if (_ns_section[0] === 'ns_rename_section') {
                    let _ns_name = e['data'][result]['dvalue'];
                    if (_ns_name.includes('displayName')) {
                        v.innerHTML = JSON.parse(_ns_name)['displayName'];
                    }
                    else {
                        v.innerHTML = _ns_name;
                    };
                }
                else if (_ns_section[0] === 'ns_auction_section') {
                    let auc = JSON.parse(e['data'][result]['dvalue']);
                    let auc_name = qsgei(x, '#' + _ns_section[0] + '_value_name');
                    let auc_price = qsgei(x, '#' + _ns_section[0] + '_value_price');
                    let auc_addr = qsgei(x, '#' + _ns_section[0] + '_value_addr');
                    auc_name.innerHTML = auc['displayName'];
                    auc_price.innerHTML = auc['price'];
                    auc_addr.innerHTML = auc['addr'];
                    v.innerHTML = auc['desc'];
                }
                else {
                    v.innerHTML = e['data'][result]['dvalue'];
                };
            };

            if (_ns_section[0] === 'ns_reply_section' || _ns_section[0] === 'ns_reward_section' || _ns_section[0] === 'ns_repost_section' || _ns_section[0] === 'ns_bid_section') {
                let ks = e['data'][result]['target'][0];
                let tv = qsgei(x, '#' + _ns_section[0] + '_target_value');

                tv.innerHTML = e['data'][result]['target'][2];
                k.innerHTML = ks + ' - ' + e['data'][result]['target'][1];
                // k.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // k.onclick = function () {
                //     section_link('shortcode', ks);
                // };
                k.title = 'View namespace';
                csl(k, 'shortcode', ks);
            }
            else if (_ns_section[0] === 'ns_bid_section') {
                let ks = e['data'][result]['target'][0];
                let tv = qsgei(x, '#' + _ns_section[0] + '_target_value');

                tv.innerHTML = e['data'][result]['target'][1];
                k.innerHTML = ks + ' - ' + e['data'][result]['target'][1];
                // k.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // k.onclick = function () {
                //     section_link('shortcode', ks);
                // };
                k.title = 'View namespace';
                csl(k, 'shortcode', ks);
            };

            let kb = e['data'][result]['block'];
            // b.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // b.onclick = function () {
            //     section_link('block', kb);
            // };
            csl(b, 'block', kb);
            b.innerText = kb;
            b.title = 'View block';
            // bi.style.cssText = 'cursor: pointer;';
            // bi.onclick = function () {
            //     section_link('block', kb);
            // };
            bi.title = 'View block';
            csl(bi, 'block', kb, 2);
            let ktxid = e['data'][result]['txid'];
            // txid.style.cssText = 'cursor: pointer;';
            // txid.onclick = function () {
            //     section_link('transaction', ktxid);
            // };
            txid.title = 'View transaction';
            csl(txid, 'transaction', ktxid, 2);

            if (e['data'][result]['replies'].length >= 1) {
                replies.className += " w3-show";
            };

            function get_ns_reply_section(dtype) {
                if (dtype === 'reply') {
                    return ['ns_regular_reply', gei('ns_regular_reply')];
                }
                else if (dtype === 'repost') {
                    return ['ns_repost_reply', gei('ns_repost_reply')];
                }
                else if (dtype === 'nft_bid') {
                    return ['ns_bid_reply', gei('ns_bid_reply')];
                }
                else if (dtype === 'reward') {
                    return ['ns_reward_reply', gei('ns_reward_reply')];
                };
            };
            for (rresult in e['data'][result]['replies']) {
                let _ns_reply_section = get_ns_reply_section(e['data'][result]['replies'][rresult]['dtype']);
                let rx = _ns_reply_section[1].cloneNode(true);
                rx.removeAttribute('id');
                let rsc = qsgei(rx, '#' + _ns_reply_section[0] + '_shortcode');
                let rt = qsgei(rx, '#' + _ns_reply_section[0] + '_time');
                let rv = qsgei(rx, '#' + _ns_reply_section[0] + '_value');
                let rb = qsgei(rx, '#' + _ns_reply_section[0] + '_block');
                let rtxid = qsgei(rx, '#' + _ns_reply_section[0] + '_txid');

                rt.innerText = e['data'][result]['replies'][rresult]['time'].slice(0, -12);
                rv.innerText = e['data'][result]['replies'][rresult]['dvalue'];

                let rbit = e['data'][result]['replies'][rresult]['block'];
                // rb.style.cssText = 'cursor: pointer;';
                // rb.onclick = function () {
                //     section_link('block', rbit);
                // };
                rb.title = 'View block';
                csl(rb, 'block', rbit, 2);
                let rtsc = e['data'][result]['replies'][rresult]['root_shortcode'];
                rsc.innerText = rtsc + ' - ' + e['data'][result]['replies'][rresult]['name'];
                rsc.title = 'View namespace';
                // rsc.style.cssText = 'cursor: pointer; text-decoration: underline;';
                // rsc.onclick = function () {
                //     section_link('shortcode', rtsc);
                // };
                csl(rsc, 'shortcode', rtsc);
                let rrtxid = e['data'][result]['replies'][rresult]['txid'];
                // rtxid.style.cssText = 'cursor: pointer;';
                // rtxid.onclick = function () {
                //     section_link('transaction', rrtxid);
                // };
                rtxid.title = 'View transaction';
                csl(rtxid, 'transaction', rrtxid, 2);

                replies.appendChild(rx);
            };
            _bexp_nsv.appendChild(x);
        };
        isection_toggle('ns_pro', ['namespace_loading', 'ns_pro']);
        isection_toggle('ns_view', ['ns_view']);
    };

    ui_clear_market_view = function () {
        isection_toggle('market_loading', ['market_loading', 'market_main']);
        let _bexp_nsv = gei('xbmarket');
        let nspro_sc = gei('mnspro_sc');

        while (_bexp_nsv.firstChild) {
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };

        nspro_sc.innerText = null;
    };

    imarket_section_toggle = function (e, h=true) {
        let _kmedia = document.getElementsByClassName('kmedia');
        let _kcontent = document.getElementsByClassName('kcontent');

        function hide(e) {
            for (let i = 0; i < e.length; i++) {
                if (e[i].className.indexOf('w3-hide') == -1) {
                    e[i].className += ' w3-hide';
                };
            };
        };
        function show(e) {
            for (let i = 0; i < e.length; i++) {
                if (e[i].className.indexOf('w3-hide') != -1) {
                    e[i].className = e[i].className.replace(' w3-hide', '');
                };
            };
        };

        if (e === 'all') {
            show(_kmedia);
            show(_kcontent);
            market_display_filter = 'all';
        }
        else if (e === 'media') {
            show(_kmedia);
            hide(_kcontent);
            market_display_filter = 'media';
        
        }
        else if (e === 'content') {
            hide(_kmedia);
            show(_kcontent);
            market_display_filter = 'content';
            
        };

        if (h === true) {
            window.history.replaceState(null, document.title, "/market");
        };

    };

    ui_update_market_view = function (e) {
        let _bexp_nsv = gei('xbmarket');
        let _nsv_c = gei('mnsv_c');
        let nspro_sc = gei('mnspro_sc');

        let spacer = ce('div');
        spacer.style.marginTop = '-16px';
        _bexp_nsv.appendChild(spacer);
        nspro_sc.innerText = e['len'];

        for (result in e['data']) {
            let x = _nsv_c.cloneNode(true);
            x.removeAttribute('id');

            let k = qsgei(x, '#mnsv_key');
            let kp = qsgei(x, '#mnsv_keyp');
            let krc = qsgei(x, '#mnsv_keyrc');
            let krh = qsgei(x, '#mnsv_keyrh');
            let t = qsgei(x, '#mnsv_time');
            let v = qsgei(x, '#mnsv_value');
            let b = qsgei(x, '#mnsv_block');
            let bi = qsgei(x, '#mnsv_blocki');
            let txid = qsgei(x, '#mnsv_txid');
            let a = qsgei(x, '#mnsv_addr');
            // let o = qsgei(x, '#mnsv_op');
            // let rc = qsgei(x, '#mnsv_rc');
            let mpreview = qsgei(x, '#mpreview');

            if ('media' in e['data'][result]) {
                mpreview.src = e['data'][result]['media'];
                x.className += ' kmedia';
            }
            else {
                if (mpreview.className.indexOf("w3-hide") == -1) {
                    mpreview.className += " w3-hide";
                };
                x.className += ' kcontent';
            };
            kp.innerText = e['data'][result]['price'] + ' KVA';
            t.innerText = e['data'][result]['time'].slice(0, -12);
            v.innerText = e['data'][result]['desc'];
            let rsc = e['data'][result]['root_shortcode'];
            k.innerText = rsc + ' - ' + e['data'][result]['displayName'];
            k.title = 'View namespace';
            // k.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // k.onclick = function () {
            //     section_link('shortcode', rsc);
            // };
            csl(k, 'shortcode', rsc);
            let kb = e['data'][result]['block'];
            // b.style.cssText = 'cursor: pointer; text-decoration: underline;';
            // b.onclick = function () {
            //     section_link('block', kb);
            // };
            csl(b, 'block', kb);
            b.innerText = kb;
            b.title = 'View block';
            bi.title = 'View block';
            // bi.onclick = function () {
            //     section_link('block', kb);
            // };
            csl(bi, 'block', kb, 2);
            let ktxid = e['data'][result]['txid'];
            // txid.onclick = function () {
            //     section_link('transaction', ktxid);
            // };
            txid.title = 'View transaction';
            csl(txid, 'transaction', ktxid, 2);

            a.innerText = e['data'][result]['owner_addr'];
            krc.innerText = e['data'][result]['bids'][0];
            _high_bid = e['data'][result]['bids'][1];
            krh.innerText = _high_bid;
            _bexp_nsv.appendChild(x);
        };
        imarket_section_toggle(market_display_filter, false);
        isection_toggle('market_main', ['market_loading', 'market_main']);
    };

    ui_clear_stats_tops = function () {
        let _bexp_nsv = gei('stats_tops_table');
        clear_table(_bexp_nsv);

        try {
            if (typeof(stats_tops_chart) !== 'undefined') {
                stats_tops_chart.destroy();
            };
        }
        catch (err) {
            console.log(err.message);
        };
    };

    ui_update_stats_tops = function (e) {
        let _bexp_nsv = gei('stats_tops_table');
        let labels = [];
        let data = [];
        let colors = [];
        let _total_counter = 100.0;
        for (result in e) {
            // console.log(e[result][1])
            labels.push(e[result][1]);
            colors.push('rgb(' + random_int(155, 255) + ', ' + random_int(55, 155) + ', ' + random_int(90, 175) + ')')
            // data.push(e[result][2]);
            if (e[result].length === 5) {
                _total_counter -= e[result][4]
                data.push(e[result][4]);
                add_row(_bexp_nsv, [e[result][0], e[result][1], e[result][2], e[result][3], e[result][4]]);
                
            }
            else {
                data.push(e[result][2]);
                add_row(_bexp_nsv, [e[result][0], e[result][1], e[result][2]]);
            };
            
            
        };
        labels.push('Non-Top 100')
        colors.push('rgb(' + random_int(155, 255) + ', ' + random_int(55, 155) + ', ' + random_int(90, 175) + ')')
        data.push(_total_counter)
        // console.log(labels)
        build_chart(labels, data, colors);
    };


    section_link = function (section, value) {
        // TODO Clear sections upon link nav and set loading display
        // NOTE Q will fire display element update when api responds back
        // TODO Set time for section fire
        // TODO decouple from section_toggle and go to isection for better history state
        if (section === 'block') {
            ui_clear_block();
            window.history.pushState({}, '', '/explorer/block/' + value);
            section_toggle("explorer_browser", true);
        }
        else if (section === 'transaction') {
            ui_clear_transaction();
            window.history.pushState({}, '', '/explorer/transaction/' + value);
            section_toggle("explorer_browser", true);
        }
        else if (section === 'address') {
            ui_clear_address();
            window.history.pushState({}, '', '/explorer/address/' + value);
            section_toggle("address_section", true);
        }
        else if (section === 'mempool') {
            ui_clear_mempool_entry();
            window.history.pushState({}, '', '/explorer/mempool/entry/' + value);
            section_toggle("explorer_browser", true);
        }
        else if (section === 'shortcode') {
            ui_clear_namespace_view();
            window.history.pushState({}, '', '/' + value);
            section_toggle("namespace_section", true);
        }
        else if (section == 'market') {
            ui_clear_market_view();
            window.history.pushState({}, '', '/market');
            section_toggle("market_section", true);
        }
        else if (section == 'about') {
            window.history.pushState({}, '', '/about');
            section_toggle("about_section", true);
        }
        else if (section == 'search') {
            ui_clear_search();
            window.history.pushState({}, '', '/search');
            section_toggle("search_section", true);
        }
        else if (section == 'home') {
            window.history.pushState({}, '', '/');
            section_toggle("main_section", true);
        };
    };

    search = function (e) {
        let _sq = null;
        let _si = gei('search' + e);
        _sq = _si.value;
        _si.value = null;
        isection_toggle('search_loading', ['search_loading', 'search_results_info']);
        ui_clear_search();
        section_toggle("search_section", false);
        if (_sq) {
            let _search_q = gei('search_q');
            _search_q.innerText = _sq;
            get_search(_sq);
        };
    };

    chart_section_toggle = function (e) {
        ui_clear_stats_tops();
        let x = gei('stthl');
        let xp = gei('stthxp');
        let xtp = gei('stthxtp');
        if (e === 'tops_balance') {
            if (xp.className.indexOf("w3-hide") != -1) {
                xp.className = xp.className.replace(" w3-hide", "");
            };
            if (xtp.className.indexOf("w3-hide") != -1) {
                xtp.className = xtp.className.replace(" w3-hide", "");
            };
        }
        else {
            if (xp.className.indexOf("w3-hide") == -1) {
                xp.className += " w3-hide";
            };
            if (xtp.className.indexOf("w3-hide") == -1) {
                xtp.className += " w3-hide";
            };
        }
        if (e === 'tops_balance') {
            x.innerText = 'Balance';
            if (xp.className.indexOf("w3-hide") != -1) {
                xp.className.replace(" w3-hide", "");
            };
            if (xtp.className.indexOf("w3-hide") != -1) {
                xtp.className.replace(" w3-hide", "");
            };
            get_stats_tops('total');
        }
        else if (e === 'tops_received') {
            x.innerText = 'Received';
            get_stats_tops('received');
        }
        else if (e === 'tops_sent') {
            x.innerText = 'Sent';
            get_stats_tops('sent');
        }
        else if (e === 'tops_receivers') {
            x.innerText = 'Received TX Count';
            get_stats_tops('rcount');
        }
        else if (e === 'tops_senders') {
            x.innerText = 'Sent TX Count';
            get_stats_tops('scount');
        };
    };

    build_chart = function (labels, data, colors) {
        let cdata = {
            labels: labels,
            datasets: [{
            //   label: '',
            backgroundColor: colors,
            borderColor: colors,
            data: data,
            }]
        };
        
        let config = {
            type: 'doughnut', //'line',
            data: cdata,
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        },
                        position: 'bottom'
                    }
                }
            }
        };

        stats_tops_chart = new Chart(
            gei('stats_tops_chart'),
            config
        );
    };

    csl = function(e, s, l, ul=1) {
        if (ul === 1) {
            e.className = 'w3-theme-hl1';
        }
        else if (ul === 0) {
            e.className = 'w3-theme-hl2';
        }
        else if (ul === 2) {
            e.className += ' w3-theme-hl2';
        };
        
        e.onclick = function () {
            section_link(s, l);
        };
    };

    qsgei = function (e, i) {
        let r_e = e.querySelector(i);
        r_e.removeAttribute('id');
        return r_e;
    };

    gei = function (e) {
        let r_e = document.getElementById(e);
        return r_e;
    };

    ce = function (e) {
        let r_e = document.createElement(e);
        return r_e;
    };

    add_row = function (t, e) {
        let _row = ce('tr');
        _row.className = 'w3-theme-text-dark w3-hover-theme-tr';
        function add_cell(_row, e) {
            let _cell = ce('td');
            if (typeof e === 'object') {
                if (e.nodeName === 'SPAN') {
                    _cell.appendChild(e);
                }
            } else {
                _cell.innerText = e;
            };
            _row.appendChild(_cell);
        };
        for (result in e) {
            add_cell(_row, e[result]);
        };

        t.appendChild(_row);
    };

    clear_table = function (table) {
        let tableHeaderRowCount = 1;
        let rowCount = table.rows.length;
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        };
    };

    rounder = function (number, places) {
        return +(Math.round(number + 'e+'.concat(places)) + 'e-'.concat(places));
    };

    random_int = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
      }

    return new nww_main();

});