var nww_main = new (function () {
    let Q = new Worker('/js/worker.js');
    // let ep = 'https://kva.keva.one/';
    let ep = 'http://127.0.0.1:9999/';

    let bc_general_update = 0;
    let bc_info_update = 0;
    let bc_news_update = 0;
    let bc_recent_blocks_update = 0;
    let bc_recent_transactions_update = 0;

    let _isections = ["address_section", "explorer_info", "explorer_stats", "explorer_browser", "market_section", "explorer_section", "namespace_section", "main_section", "search_section", "error_section", "about_section"];
    let _ibsections = ["explorer_info", "explorer_stats", "market_section", "explorer_section", "namespace_section", "main_section", "search_section", "about_section"];

    function nww_main() {
        //console.log('main');
        check_state();

        Q.onmessage = function (e) {
            console.log('Message received from worker', e['data']);
            if (e['data'][0]['call'] === 'get_supply') {
                return nww_main.prototype.ui_update_supply(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_block') {
                return nww_main.prototype.ui_update_block(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_recent_blocks') {
                return nww_main.prototype.ui_update_recent_blocks(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_recent_transactions') {
                return nww_main.prototype.ui_update_recent_transactions(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'rpc_get_raw_mempool') {
                return nww_main.prototype.ui_update_mempool(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_transaction') {
                return nww_main.prototype.ui_update_transaction(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_address') {
                return nww_main.prototype.ui_update_address(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_search') {
                return nww_main.prototype.ui_update_search(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'rpc_get_mempool_entry') {
                return nww_main.prototype.ui_update_mempool_entry(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_shortcode') {
                return nww_main.prototype.ui_update_namespace_view(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_namespace') {
                return nww_main.prototype.ui_update_namespace_view(e['data'][1]);
            }
            else if (e['data'][0]['call'] === 'get_nft_auctions') {
                return nww_main.prototype.ui_update_market_view(e['data'][1]);
            }
            // else if (e['data'][0]['call'] === 'get_info') {
            else if (e['data'][0]['call'] === 'README.md') {
                return nww_main.prototype.ui_update_info(e['data'][1]);
            };
        };
        nww_main.prototype.get_supply();
        window.setInterval(nww_main.prototype.get_supply, 30000);
        window.onpopstate = function () {
            check_state();
        };
    };

    function check_state() {
        let _path = window.location.pathname;
        let _d = new Date().getTime();

        if (_path.startsWith("/info")) {
            if (bc_info_update < _d - 3000) {
                nww_main.prototype.get_info();
                bc_info_update = _d;
            };
            document.title = "Keva.One - Kevacoin Info";
            nww_main.prototype.isection_toggle("explorer_section", _isections);
            nww_main.prototype.section_toggle("explorer_info", false);
        }
        // else if (_path.startsWith("/news")) {
        //         nww_main.prototype.isection_toggle("explorer_section", ["explorer_section", "namespace_section"]);
        //         nww_main.prototype.section_toggle("bexp_news", false);
        // }
        else if (_path.startsWith("/stats")) {
            document.title = "Keva.One - Kevacoin Stats";
            nww_main.prototype.isection_toggle("explorer_section", _isections);
            nww_main.prototype.section_toggle("explorer_stats", false);
        }
        else if (_path.startsWith("/explorer")) {
            document.title = "Keva.One - Kevacoin Explorer";
            nww_main.prototype.isection_toggle("explorer_section", _isections);
            nww_main.prototype.section_toggle("explorer_browser", false);
            if (_path === "/explorer/recent-blocks") {
                document.title = "Keva.One - Kevacoin Recent Blocks";
                nww_main.prototype.get_recent_blocks();
                nww_main.prototype.exp_section_toggle("explorer_recent_blocks", false);
            }
            else if (_path === "/explorer/recent-transactions") {
                document.title = "Keva.One - Kevacoin Recent Transactions";
                nww_main.prototype.get_recent_transactions();
                nww_main.prototype.exp_section_toggle("explorer_recent_transactions", false);
            }
            else if (_path === "/explorer/mempool") {
                document.title = "Keva.One - Kevacoin Mempool";
                nww_main.prototype.get_raw_mempool();
                nww_main.prototype.exp_section_toggle("explorer_mempool", false);
            }
            else if (_path.startsWith("/explorer/block/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Block " + _p[_p.length - 1];
                nww_main.prototype.get_block(_p[_p.length - 1]);
                nww_main.prototype.exp_section_toggle("explorer_block", false);
            }
            else if (_path.startsWith("/explorer/transaction/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Transaction " + _p[_p.length - 1];
                nww_main.prototype.get_transaction(_p[_p.length - 1]);
                nww_main.prototype.exp_section_toggle("explorer_transaction", false);
            }
            else if (_path.startsWith("/explorer/address/")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Address " + _p[_p.length - 1];
                nww_main.prototype.get_address(_p[_p.length - 1]);
                nww_main.prototype.isection_toggle("address_section", _isections);
            }
            else if (_path.startsWith("/explorer/mempool/entry")) {
                let _p = _path.split("/")
                document.title = "Keva.One - Kevacoin Mempool Entry " + _p[_p.length - 1];
                nww_main.prototype.get_mempool_entry(_p[_p.length - 1]);
                nww_main.prototype.exp_section_toggle("explorer_mempool_entry", false);
            }
            else if (_path.startsWith("/explorer/search")) {
                document.title = "Keva.One - Kevacoin Search";
                nww_main.prototype.isection_toggle("explorer_section", _isections);
            }
            else {
                nww_main.prototype.get_recent_blocks();
            };
        }
        else if (_path.startsWith("/market")) {
            document.title = "Keva.One - Kevacoin Auctions";
            nww_main.prototype.get_nft_auctions();
            nww_main.prototype.isection_toggle("market_section", _isections);
        }
        else if (_path.startsWith("/search")) {
            document.title = "Keva.One - Search";
            nww_main.prototype.isection_toggle("search_section", _isections);
        }
        else if (_path.startsWith("/error")) {
            document.title = "Keva.One - Error";
            nww_main.prototype.isection_toggle("error_section", _isections);
        }
        else if (_path.startsWith("/about")) {
            document.title = "Keva.One - About";
            nww_main.prototype.isection_toggle("about_section", _isections);
        }
        else if (_path === "/") {
            document.title = "Keva.One";
            nww_main.prototype.isection_toggle("main_section", _isections);
        }
        else {
            let _p = _path.split("/");

            if (_p[_p.length - 1].length > parseInt(_p[_p.length - 1][0]) + 1) {
                document.title = "Keva.One - Kevacoin Shortcode " + _p[_p.length - 1];
                nww_main.prototype.get_shortcode(_p[_p.length - 1]);
                nww_main.prototype.isection_toggle("namespace_section", _isections);
            }
            else if (_p[_p.length - 1].startsWith('N') & _p[_p.length - 1].length === 34) {
                document.title = "Keva.One - Kevacoin Namespace " + _p[_p.length - 1];
                nww_main.prototype.get_namespace(_p[_p.length - 1]);
                nww_main.prototype.isection_toggle("namespace_section", _isections);
            }
            else {
                document.title = "Keva.One - Error";
                let _error_msg = document.getElementById('error_msg');
                _error_msg.innerText = 'Nothing there!';
                nww_main.prototype.section_toggle('error_section', false);
            };
        };
    };

    nww_main.prototype.myFunction = function (id) {
        var x = document.getElementById(id);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
            x.previousElementSibling.className += " w3-theme-d1";
        } else {
            x.className = x.className.replace("w3-show", "");
            x.previousElementSibling.className =
                x.previousElementSibling.className.replace(" w3-theme-d1", "");
        };
    };

    nww_main.prototype.isection_toggle = function (id, sections) {
        for (let i = 0; i < sections.length; i++) {
            let section = document.getElementById(sections[i]);
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

    nww_main.prototype.section_toggle = function (id, cs = true) {
        let sections = ["explorer_info", "explorer_stats", "explorer_browser", "market_section", "main_section", "search_section", "error_section", "about_section"];
        nww_main.prototype.isection_toggle(id, sections);
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
                    !_path.startsWith("/explorer/recent-blocks/") &
                    !_path.startsWith("/explorer/recent-transactions/") &
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
                    !_path.startsWith("/explorer/recent-blocks/") &
                    !_path.startsWith("/explorer/recent-transactions/") &
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

    nww_main.prototype.exp_section_toggle = function (id, cs = true) {
        let sections = ["explorer_recent_blocks", "explorer_recent_transactions", "explorer_mempool", "explorer_block", "explorer_transaction", "explorer_mempool_entry"];
        nww_main.prototype.isection_toggle(id, sections);
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

    nww_main.prototype.get_supply = function () {
        let _path = window.location.pathname;
        if (_path.startsWith("/info") || _path.startsWith("/stats") || _path.startsWith("/explorer")) {
            let _pl = {};
            _pl['endPoint'] = ep;
            _pl['call'] = 'get_supply';
            _pl['type'] = 'GET';
            Q.postMessage(_pl);
        };
    };

    nww_main.prototype.get_block = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;

        if (e.length === 64) {
            _pl['call'] = 'get_block';
            _pl['call_data'] = e;
        } else {
            _pl['call'] = 'get_block';
            _pl['call_data'] = parseInt(e);
        };

        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_transaction = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_transaction';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_address = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_address';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_namespace = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_namespace';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_shortcode = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_shortcode';
        _pl['call_data'] = parseInt(e);
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_nft_auctions = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_nft_auctions';
        // _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_info = function (e) {
        let _pl = {};
        _pl['endPoint'] = 'https://raw.githubusercontent.com/kevacoin-project/kevacoin/master/';
        _pl['call'] = 'README.md';
        // _pl['endPoint'] = ep;
        // _pl['call'] = 'get_info';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_recent_blocks = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_recent_blocks';
        _pl['call_data'] = '?page_size=15';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_recent_transactions = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_recent_transactions';
        _pl['call_data'] = '?page_size=15';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_raw_mempool = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'rpc_get_raw_mempool';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_mempool_entry = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'rpc_get_mempool_entry';
        _pl['call_data'] = e;
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.get_search = function (e) {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_search';
        _pl['call_data'] = e;

        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.ui_update_recent_blocks = function (e) {
        let _uibexp_rb = document.getElementById('uibexp_rb');
        clear_table(_uibexp_rb);

        for (result in e[1]['page_results']) {
            let _bh_lnk = ce('span');
            _bh_lnk.innerText = e[1]['page_results'][result][0];
            _bh_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            _bh_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _bh_lnk.innerText);
            };
            let _b_lnk = ce('span');
            _b_lnk.innerText = e[1]['page_results'][result][1];
            _b_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            _b_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _b_lnk.innerText);
            };
            let _r = [e[1]['page_results'][result][2].slice(0, -12), _bh_lnk, _b_lnk, e[1]['page_results'][result][3], e[1]['page_results'][result][4]];
            add_row(_uibexp_rb, _r);
        };
    };

    nww_main.prototype.ui_update_recent_transactions = function (e) {
        let _uibexp_rt = document.getElementById('uibexp_rt');
        clear_table(_uibexp_rt);

        for (result in e[1]['page_results']) {
            let _tx_lnk = ce('span');
            let tx = e[1]['page_results'][result];
            _tx_lnk.innerText = tx[1];
            _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', _tx_lnk.innerText);
            };
            let _b_lnk = ce('span');
            _b_lnk.innerText = tx[0];
            _b_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            _b_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _b_lnk.innerText);
            };
            let _r = [tx[2].slice(0, -12), _b_lnk, _tx_lnk, tx[3], tx[4], tx[5]];
            add_row(_uibexp_rt, _r);
        };
    };

    nww_main.prototype.ui_update_mempool = function (e) {
        let _uibexp_rm = document.getElementById('uibexp_rm');
        clear_table(_uibexp_rm);
        if (typeof e == 'object') {
            for (result in e) {
                let _tx_lnk = ce('span');
                _tx_lnk.innerText = e[result];
                _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
                _tx_lnk.onclick = function () {
                    nww_main.prototype.section_link('mempool', _tx_lnk.innerText);
                };
                // let _b_lnk = ce('span');
                // _b_lnk.innerText = e[1]['page_results'][result][1];
                // _b_lnk.onclick = function() {
                //     nww_main.prototype.section_link('block', _b_lnk.innerText);
                // };
                let _r = [_tx_lnk];
                add_row(_uibexp_rm, _r);
            };
        }
        else {
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = e;
            _tx_lnk.style.cssText = 'cursor: pointer; text-decoration: underline;';
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('mempool', _tx_lnk.innerText);
            };
            let _r = [_tx_lnk];
            add_row(_uibexp_rm, _r);
        };
    };

    nww_main.prototype.ui_update_supply = function (e) {
        let _height = document.getElementById('uibs_height');
        let _supply = document.getElementById('uibs_supply');
        let _fees = document.getElementById('uibs_fees');
        let _uibs_genreward = document.getElementById('uibs_genreward');
        let _uibs_diff = document.getElementById('uibs_diff');
        let _uibs_nethash = document.getElementById('uibs_nethash');

        _height.innerText = e['block_height'];
        _supply.innerText = e['coin_supply'];
        _fees.innerText = e['fees_payed'];
        _uibs_genreward.innerText = e['genisis_reward'];
        _uibs_diff.innerText = rounder(e['difficulty'], '3');
        _uibs_nethash.innerText = rounder(e['networkhashps'], '3');
    };

    nww_main.prototype.ui_update_search = function (e) {
        console.log('e', e);
        // let _height = document.getElementById('uibs_height');
        // let _supply = document.getElementById('uibs_supply');
        // let _fees = document.getElementById('uibs_fees');
        // let _uibs_genreward = document.getElementById('uibs_genreward');
        // let _uibs_diff = document.getElementById('uibs_diff');
        // let _uibs_nethash = document.getElementById('uibs_nethash');

        // _height.innerText = e['block_height'];
        // _supply.innerText = e['coin_supply'];
        // _fees.innerText = e['fees_payed'];
        // _uibs_genreward.innerText = e['genisis_reward'];
        // _uibs_diff.innerText = rounder(e['difficulty'], '3');
        // _uibs_nethash.innerText = rounder(e['networkhashps'], '3');
    };

    nww_main.prototype.ui_update_block = function (e) {
        let _height = document.getElementById('uibexp_bheight');
        let _hash = document.getElementById('uibexp_bhash');
        let _version = document.getElementById('uibexp_bversion');
        let _phash = document.getElementById('uibexp_bphash');
        let _merkle = document.getElementById('uibexp_bmerkle');
        let _time = document.getElementById('uibexp_btime');
        let _bits = document.getElementById('uibexp_bbits');
        let _nonce = document.getElementById('uibexp_bnonce');
        let _extra = document.getElementById('uibexp_bextra');
        let _bt = document.getElementById('uibexp_bt');
        let _uibexp_betxc = document.getElementById('uibexp_betxc');

        clear_table(_bt);

        _height.innerText = e['height'];
        _hash.innerText = e['blockhash'];
        _version.innerText = e['header']['version'];
        _phash.innerText = e['header']['prev_hash'];
        _phash.onclick = function () {
            nww_main.prototype.section_link('block', e['header']['prev_hash']);
        };
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
                console.log('sats', sats);
            };
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = r['txid'];
            
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', r['txid']);
            };
            add_row(_bt, [_tx_lnk, r['vin'].length, r['vout'].length, sats]);
        };
    };

    nww_main.prototype.ui_update_transaction = function (e) {
        let _id = document.getElementById('uibexp_ti');
        let _uibexp_time = document.getElementById('uibexp_time');
        let _hash = document.getElementById('uibexp_th');
        let _locktime = document.getElementById('uibexp_tl');
        let _version = document.getElementById('uibexp_tv');
        let _size = document.getElementById('uibexp_ts');
        let _vsize = document.getElementById('uibexp_tvs');
        let _vin = document.getElementById('uibexp_tin');
        let _vout = document.getElementById('uibexp_tout');
        let _wit = document.getElementById('uibexp_twit');
        let _uibexp_txinputs = document.getElementById('uibexp_txinputs');
        let _uibexp_txoutputs = document.getElementById('uibexp_txoutputs');
        let _uibexp_txwit = document.getElementById('uibexp_txwit');
        clear_table(_vin);
        clear_table(_vout);
        clear_table(_wit);

        _id.innerText = e['txid'];
        uibexp_time.innerText = e['time'].slice(0, -12);
        _hash.innerText = e['hash'];
        _locktime.innerText = e['locktime'];
        _version.innerText = e['version'];
        _size.innerText = 0;
        _vsize.innerText = 0;
        _uibexp_txinputs.innerText = e['vin'].length;
        for (result in e['vin']) {
            let _tx_lnk = ce('span');
            let _tx = e['vin'][result]['txid'];
            _tx_lnk.innerText = e['vin'][result]['txid'];
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', _tx);
            };
            e['vin'][result]['txid'] = _tx_lnk;
            add_row(_vin, e['vin'][result]);
        };
        _uibexp_txoutputs.innerText = e['vout'].length;
        for (result in e['vout']) {
            let _addr_lnk = ce('span');
            let _addr = e['vout'][result]['script_pubkey'];
            _addr_lnk.innerText = _addr;
            _addr_lnk.onclick = function () {
                nww_main.prototype.section_link('address', _addr);
            };
            e['vout'][result]['script_pubkey'] = _addr_lnk;
            add_row(_vout, e['vout'][result]);
        };
        _uibexp_txwit.innerText = e['witness'].length;
        for (result in e['witness']) {
            add_row(_wit, e['witness'][result]);
        };
    };

    nww_main.prototype.ui_update_address = function (e) {
        let _received = document.getElementById('uibexp_ar');
        let _sent = document.getElementById('uibexp_as');
        let _balance = document.getElementById('uibexp_ab');
        let _total_results = document.getElementById('uibexp_att');
        let _recent_tx = document.getElementById('uibexp_art');
        let _uibexp_ai = document.getElementById('uibexp_ai');
        clear_table(_recent_tx);
        _uibexp_ai.innerText = e[0]['address'];
        _received.innerText = e[0]['received'];
        _sent.innerText = e[0]['sent'];
        _balance.innerText = e[0]['balance'];
        _total_results.innerText = e[1]['total_results'];

        for (result in e[1]['page_results']) {
            let r = e[1]['page_results'][result];
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = r['txid'].split(':')[0];
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', _tx_lnk.innerText);
            };
            add_row(_recent_tx, [r['time'].slice(0, -12), r['block'], _tx_lnk, r['value'], r['direction']]);
        };
    };

    nww_main.prototype.ui_update_mempool_entry = function (e) {
        let _mat = document.getElementById('uibexp_mat');
        let _mdt = document.getElementById('uibexp_mdt');
        clear_table(_mat);
        clear_table(_mdt);
        let _m = document.getElementById('uibexp_mti');
        let ancestorcount = document.getElementById('uibexp_mac');
        let ancestorfees = document.getElementById('uibexp_maf');
        let ancestorsize = document.getElementById('uibexp_mas');
        let depends = document.getElementById('uibexp_md');
        let descendantcount = document.getElementById('uibexp_mdc');
        let descendantfees = document.getElementById('uibexp_mdf');
        let descendantsize = document.getElementById('uibexp_mds');
        let fee = document.getElementById('uibexp_mfee');
        let height = document.getElementById('uibexp_mh');
        let modifiedfee = document.getElementById('uibexp_mf');
        let size = document.getElementById('uibexp_ms');
        let time = document.getElementById('uibexp_mtime');
        let wtxid = document.getElementById('uibexp_mwtx');
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
    };

    nww_main.prototype.ui_update_info = function (e) {
        let _received = document.getElementById('bexp_inftext');
        _received.innerText = e;
    };

    nww_main.prototype.ui_update_namespace_view = function (e) {
        if (e === 'Invaild Shortcode') {
            let _error_msg = document.getElementById('error_msg');
            _error_msg.innerText = e;
            nww_main.prototype.section_toggle('error_section', false);
            return;
        };
        let _bexp_nsv = document.getElementById('ns_view');

        let nspro_name = document.getElementById('nspro_name');
        let nspro_sc = document.getElementById('nspro_sc');
        let nspro_nsid = document.getElementById('nspro_nsid');
        let nspro_keys = document.getElementById('nspro_keys');
        let nspro_owner = document.getElementById('nspro_owner');
        let name_set = false;


        while (_bexp_nsv.firstChild) {
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };
        let spacer = ce('div');
        spacer.style.marginTop = '-16px';
        _bexp_nsv.appendChild(spacer);
        e['data'].reverse();

        nspro_nsid.innerText = e['dnsid'];
        nspro_nsid.onclick = function () {
            nww_main.prototype.section_link('shortcode', nspro_nsid.innerText);
        };
        nspro_sc.innerText = e['root_shortcode'];
        nspro_sc.onclick = function () {
            nww_main.prototype.section_link('shortcode', nspro_sc.innerText);
        };
        nspro_keys.innerText = e['data'].length;
        nspro_owner.innerText = e['data'][0]['addr'];
        nspro_owner.onclick = function () {
            nww_main.prototype.section_link('address', nspro_owner.innerText);
        };

        function get_ns_section(dtype) {
            if (dtype === 'ns_create') {
                return ['ns_create_section', document.getElementById('ns_create_section')];
            }
            else if (dtype === 'name_update') {
                return ['ns_rename_section', document.getElementById('ns_rename_section')];
            }
            else if (dtype === 'nft_auction') {
                return ['ns_auction_section', document.getElementById('ns_auction_section')];
            }
            else if (dtype === '') {
                return ['ns_regular_section', document.getElementById('ns_regular_section')];
            }
            else if (dtype === 'reply') {
                return ['ns_reply_section', document.getElementById('ns_reply_section')];
            }
            else if (dtype === 'repost') {
                return ['ns_repost_section', document.getElementById('ns_repost_section')];
            }
            else if (dtype === 'nft_bid') {
                return ['ns_bid_section', document.getElementById('ns_bid_section')];
            }
            else if (dtype === 'reward') {
                return ['ns_reward_section', document.getElementById('ns_reward_section')];
            };
        };
        for (result in e['data']) {
            // console.log('result', e['data'][result]['dtype'])
            let _ns_section = get_ns_section(e['data'][result]['dtype']);
            // console.log('_ns_section', _ns_section)
            let x = _ns_section[1].cloneNode(true);
            let k = x.querySelector('#' + _ns_section[0] + '_key');
            let t = x.querySelector('#' + _ns_section[0] + '_time');
            let v = x.querySelector('#' + _ns_section[0] + '_value');
            let b = x.querySelector('#' + _ns_section[0] + '_block');
            let bi = x.querySelector('#' + _ns_section[0] + '_blocki');
            let txid = x.querySelector('#' + _ns_section[0] + '_txid');
            // let a = x.querySelector('#nsv_addr');
            // let o = x.querySelector('#nsv_op');
            // let rc = x.querySelector('#nsv_rc');
            let replies = x.querySelector('#' + _ns_section[0] + '_replies');
            // let _nst = x.querySelector('#nst');
            x.id = 'nsv_k' + e['data'][result]['timestamp'];
            k.id = 'nsv_key' + e['data'][result]['timestamp'];
            t.id = 'nsv_time' + e['data'][result]['timestamp'];
            v.id = 'nsv_value' + e['data'][result]['timestamp'];
            b.id = 'nsv_block' + e['data'][result]['timestamp'];
            bi.id = 'nsv_blocki' + e['data'][result]['timestamp'];
            txid.id = 'nsv_txid' + e['data'][result]['timestamp'];
            // a.id = 'nsv_addr' + e['data'][result]['timestamp'];
            // o.id = 'nsv_op' + e['data'][result]['timestamp'];
            // rc.id = 'nsv_rc' + e['data'][result]['timestamp'];
            k.innerText = e['data'][result]['dkey'];
            t.innerText = e['data'][result]['time'].slice(0, -12);
            // console.log(e['data'][result]['dtype'])


            if (e['data'][result]['dkey'] === 'html') {
                v.innerText = '';
                let ifra = ce('iframe');
                ifra.srcdoc = e['data'][result]['dvalue'];
                ifra.style.cssText = 'width: 200%; height: 200vh; -webkit-transform: scale(.5); transform: scale(.5); -webkit-transform-origin: 0 0; transform-origin: 0 0;';
                v.appendChild(ifra);
            }
            else {
                v.innerHTML = e['data'][result]['dvalue'];
            };

            let kb = e['data'][result]['block'];
            b.style.cssText = 'cursor: pointer; text-decoration: underline;';
            b.onclick = function () {
                nww_main.prototype.section_link('block', kb);
            };
            b.innerText = kb;
            bi.style.cssText = 'cursor: pointer;';
            bi.onclick = function () {
                nww_main.prototype.section_link('block', kb);
            };
            let ktxid = e['data'][result]['txid'];
            txid.style.cssText = 'cursor: pointer;';
            txid.onclick = function () {
                nww_main.prototype.section_link('transaction', ktxid);
            };

            // a.innerText = e['data'][result]['addr'];
            // o.innerText = e['data'][result]['op'];
            // rc.innerText = e['data'][result]['replies'].length;
            if (e['data'][result]['replies'].length >= 1) {
                replies.className += " w3-show";
            };
            if (!name_set) {
                if (e['data'][result]['dkey'].endsWith('_KEVA_NS_')) {
                    try {
                        let nn = JSON.parse(e['data'][result]['dvalue']);
                        nspro_name.innerText = nn['displayName'];
                        name_set = true;
                    }
                    catch {
                        nspro_name.innerText = e['data'][result]['dvalue'];
                        name_set = true;
                    };
                };
            };

            function get_ns_reply_section(dtype) {
                if (dtype === 'reply') {
                    return ['ns_regular_reply', document.getElementById('ns_regular_reply')];
                }
                else if (dtype === 'repost') {
                    return ['ns_repost_reply', document.getElementById('ns_repost_reply')];
                }
                else if (dtype === 'nft_bid') {
                    return ['ns_bid_reply', document.getElementById('ns_bid_reply')];
                }
                else if (dtype === 'reward') {
                    return ['ns_reward_reply', document.getElementById('ns_reward_reply')];
                };
            };
            for (rresult in e['data'][result]['replies']) {
                // console.log(e['data'][result]['replies'][rresult]['dtype'])
                let _ns_reply_section = get_ns_reply_section(e['data'][result]['replies'][rresult]['dtype']);
                
                let rx = _ns_reply_section[1].cloneNode(true);
                let rsc = rx.querySelector('#' + _ns_reply_section[0] + '_shortcode');
                let rt = rx.querySelector('#' + _ns_reply_section[0] + '_time');
                let rv = rx.querySelector('#' + _ns_reply_section[0] + '_value');
                let rb = rx.querySelector('#' + _ns_reply_section[0] + '_block');
                // let rbi = rx.querySelector('#' + _ns_reply_section[0] + '_blocki');
                let rtxid = rx.querySelector('#' + _ns_reply_section[0] + '_txid');

                rx.id = 'nsv_rk' + e['data'][result]['replies'][rresult]['timestamp'];
                rt.id = 'nsv_rtime' + e['data'][result]['replies'][rresult]['timestamp'];
                rv.id = 'nsv_rvalue' + e['data'][result]['replies'][rresult]['timestamp'];
                // rb.id = 'nsv_rblock' + e['data'][result]['replies'][rresult]['timestamp'];
                // rbi.id = 'nsv_rblocki' + e['data'][result]['replies'][rresult]['timestamp'];
                rtxid.id = 'nsv_rtxid' + e['data'][result]['replies'][rresult]['timestamp'];
                rt.innerText = e['data'][result]['replies'][rresult]['time'].slice(0, -12);

                rv.innerText = e['data'][result]['replies'][rresult]['dvalue'];

                let rbit = e['data'][result]['replies'][rresult]['block'];
                rb.style.cssText = 'cursor: pointer;';
                rb.onclick = function () {
                    nww_main.prototype.section_link('block', rbit);
                };
                // rbi.style.cssText = 'cursor: pointer;';
                // rbi.onclick = function () {
                //     nww_main.prototype.section_link('block', rbit);
                // };
                let rtsc = e['data'][result]['replies'][rresult]['root_shortcode'];
                rsc.innerText = rtsc;
                rsc.style.cssText = 'cursor: pointer; text-decoration: underline;';
                rsc.onclick = function () {
                    nww_main.prototype.section_link('shortcode', rsc.innerText);
                };
                let rrtxid = e['data'][result]['replies'][rresult]['txid'];
                rtxid.style.cssText = 'cursor: pointer;';
                rtxid.onclick = function () {
                    nww_main.prototype.section_link('transaction', rrtxid);
                };

                replies.appendChild(rx);
            };
            _bexp_nsv.appendChild(x);
        };
    };

    nww_main.prototype.ui_update_market_view = function (e) {
        let _bexp_nsv = document.getElementById('xbmarket');
        let _nsv_c = document.getElementById('mnsv_c');
        let nspro_name = document.getElementById('mnspro_name');
        let nspro_sc = document.getElementById('mnspro_sc');
        let nspro_nsid = document.getElementById('mnspro_nsid');
        let nspro_keys = document.getElementById('mnspro_keys');
        let nspro_owner = document.getElementById('mnspro_owner');
        let name_set = false;

        while (_bexp_nsv.firstChild) {
            // TODO null out all children before removal, memory leaking here
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };
        let spacer = ce('div');
        spacer.style.marginTop = '-16px';
        _bexp_nsv.appendChild(spacer);

        e['data'].reverse();
        nspro_sc.innerText = e['len'];

        for (result in e['data']) {
            let x = _nsv_c.cloneNode(true);
            let k = x.querySelector('#mnsv_key');
            let kp = x.querySelector('#mnsv_keyp');
            let krc = x.querySelector('#mnsv_keyrc');
            let krh = x.querySelector('#mnsv_keyrh');
            let t = x.querySelector('#mnsv_time');
            let v = x.querySelector('#mnsv_value');
            let b = x.querySelector('#mnsv_block');
            let bi = x.querySelector('#mnsv_blocki');
            let txid = x.querySelector('#mnsv_txid');
            let a = x.querySelector('#mnsv_addr');
            let o = x.querySelector('#mnsv_op');
            let rc = x.querySelector('#mnsv_rc');
            let mpreview = x.querySelector('#mpreview');
            let replies = x.querySelector('#mnsv_replies');
            x.id = 'mnsv_k' + e['data'][result]['timestamp'];
            k.id = 'mnsv_key' + e['data'][result]['timestamp'];
            t.id = 'mnsv_time' + e['data'][result]['timestamp'];
            v.id = 'mnsv_value' + e['data'][result]['timestamp'];
            b.id = 'mnsv_block' + e['data'][result]['timestamp'];
            txid.id = 'mnsv_txid' + e['data'][result]['timestamp'];
            a.id = 'mnsv_addr' + e['data'][result]['timestamp'];
            o.id = 'mnsv_op' + e['data'][result]['timestamp'];
            rc.id = 'mnsv_rc' + e['data'][result]['timestamp'];
            mpreview.id = 'mpreview' + e['data'][result]['timestamp'];

            if ('media' in e['data'][result]) {
                mpreview.src = e['data'][result]['media'];
            }
            else {
                if (mpreview.className.indexOf("w3-hide") == -1) {
                    mpreview.className += " w3-hide";
                }
            };
            kp.innerText = e['data'][result]['price'] + ' KVA';
            t.innerText = e['data'][result]['time'].slice(0, -12);
            v.innerText = e['data'][result]['desc'];
            let rsc = e['data'][result]['root_shortcode'];
            k.innerText = rsc + ' - ' + e['data'][result]['displayName'];
            k.style.cssText = 'cursor: pointer; text-decoration: underline;';
            k.onclick = function () {
                nww_main.prototype.section_link('shortcode', rsc);
            };
            // let kb = e['data'][result]['key_shortcode'].slice(1, parseInt(e['data'][result]['key_shortcode'][0]) + 1);
            let kb = e['data'][result]['block'];
            b.style.cssText = 'cursor: pointer; text-decoration: underline;';
            b.onclick = function () {
                nww_main.prototype.section_link('block', kb);
            };
            b.innerText = kb;
            bi.onclick = function () {
                nww_main.prototype.section_link('block', kb);
            };
            let ktxid = e['data'][result]['txid'];
            txid.onclick = function () {
                nww_main.prototype.section_link('transaction', ktxid);
            };

            a.innerText = e['data'][result]['owner_addr'];
            krc.innerText = e['data'][result]['bids'][0];
            _high_bid = e['data'][result]['bids'][1];
            krh.innerText = _high_bid;
            _bexp_nsv.appendChild(x);
        };
    };

    nww_main.prototype.section_link = function (section, value) {
        if (section === 'block') {
            window.history.pushState({}, '', '/explorer/block/' + value);
            nww_main.prototype.section_toggle("explorer_browser", true);
        }
        else if (section === 'transaction') {
            window.history.pushState({}, '', '/explorer/transaction/' + value);
            nww_main.prototype.section_toggle("explorer_browser", true);
        }
        else if (section === 'address') {
            window.history.pushState({}, '', '/explorer/address/' + value);
            nww_main.prototype.section_toggle("address_section", true);
        }
        else if (section === 'mempool') {
            window.history.pushState({}, '', '/explorer/mempool/entry/' + value);
            nww_main.prototype.section_toggle("explorer_browser", true);
        }
        else if (section === 'shortcode') {
            window.history.pushState({}, '', '/' + value);
            nww_main.prototype.section_toggle("namespace_section", true);
        }
        else if (section == 'market') {
            window.history.pushState({}, '', '/market');
            nww_main.prototype.section_toggle("market_section", true);
        }
        else if (section == 'about') {
            window.history.pushState({}, '', '/about');
            nww_main.prototype.section_toggle("about_section", true);
        }
        else if (section == 'search') {
            window.history.pushState({}, '', '/search');
            nww_main.prototype.section_toggle("search_section", true);
        }
        else if (section == 'home') {
            window.history.pushState({}, '', '/');
            nww_main.prototype.section_toggle("main_section", true);
        };
    };

    nww_main.prototype.search = function () {
        //block
        nww_main.prototype.get_search('abcba0ef22626a399bffb087379815f650ac7551eb4cd1992d065760f0f43867');
        //tx
        nww_main.prototype.get_search('0ded5d9c76555f51049935a2b54d31e6e6479159f0c893ba7bcb8ecdb5758fce');

        nww_main.prototype.get_search('*raven*');

        nww_main.prototype.get_search('VNFYuykm2FGcU6ga5ti8Sg7P9okZQaJZW5');
        nww_main.prototype.get_search('Nfw2WYkGoSKve74cCfEum67x8bFgpHygxg');
        
        nww_main.prototype.section_toggle("search_section", false);
        // let _search = document.getElementById('uibssrc');
        // let sc = false;
        // let _sv = Number(_search.value);
        // if (_sv >= 0 & _search.value.length <= 16) {
        //     let _height = document.getElementById('uibs_height');
        //     if (_sv <= parseInt(_height.innerText) & _sv >= 0) {
        //         console.log(typeof _sv, _sv, '_sv might be block');
        //     };
        //     if (_search.value.length > parseInt(_search.value[0]) + 1) {
        //         if (parseInt(_height.innerText) > _search.value.slice(1, parseInt(_search.value[0]) + 1)) {
        //             console.log(typeof _sv, _sv, '_sv might be shortcode');
        //             // sc = true;
        //         };
        //     };
        //     if (!sc) {
        //         nww_main.prototype.get_block(_sv);
        //         window.history.replaceState(null, document.title, "/explorer/block/" + _sv);
        //         nww_main.prototype.exp_section_toggle("explorer_block", false);
        //     };
        // }
        // else if (_search.value.length === 64) {
        //     console.log(typeof _sv, _sv, '_sv might be blockhash / txhash');
        // }
        // else if (_search.value.length === 34) {
        //     console.log(typeof _sv, _sv, '_sv might be address / namespace');
        //     if (!sc) {
        //         nww_main.prototype.get_address(_search.value);
        //         window.history.replaceState(null, document.title, "/explorer/address/" + _search.value);
        //         nww_main.prototype.exp_section_toggle("explorer_address", false);
        //     };
        // };
        // console.log(typeof _sv, _sv, _search.value.length, _search.value.slice(1, parseInt(_search.value[0]) + 1));
    };

    ce = function (e) {
        let r_e = document.createElement(e);
        return r_e;
    };

    add_row = function (t, e) {
        let _row = ce('tr');
        function add_cell(_row, e) {
            let _cell = ce('td');
            if (typeof e === 'object') {
                if (e.nodeName === 'SPAN') {
                    _cell.appendChild(e);
                }
            } else {
                _cell.innerText = e;
            }
            _row.appendChild(_cell);
        }
        for (result in e) {
            add_cell(_row, e[result]);
        }

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

    return new nww_main();

});