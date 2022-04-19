var nww_main = new (function () {
    let Q = new Worker('/js/worker.js');
    // let ep = 'https://kva.keva.one/'
    let ep = 'http://127.0.0.1:9999/'

    let bc_general_update = 0;
    let bc_info_update = 0;
    let bc_news_update = 0;
    let bc_recent_blocks_update = 0;
    let bc_recent_transactions_update = 0;

    function nww_main() {
        //console.log('main');
        check_state();

        Q.onmessage = function (e) {
            console.log('Message received from worker', e['data']);
            if (e['data'][0]['call'] === 'get_supply') {
                nww_main.prototype.ui_update_supply(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_block') {
                nww_main.prototype.ui_update_block(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_recent_blocks') {
                nww_main.prototype.ui_update_recent_blocks(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_recent_transactions') {
                nww_main.prototype.ui_update_recent_transactions(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'rpc_get_raw_mempool') {
                nww_main.prototype.ui_update_mempool(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_transaction') {
                nww_main.prototype.ui_update_transaction(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_address') {
                nww_main.prototype.ui_update_address(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'rpc_get_mempool_entry') {
                nww_main.prototype.ui_update_mempool_entry(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_shortcode') {
                nww_main.prototype.ui_update_namespace_view(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_namespace') {
                nww_main.prototype.ui_update_namespace_view(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_nft_auctions') {
                nww_main.prototype.ui_update_market_view(e['data'][1])
            }
            // else if (e['data'][0]['call'] === 'get_info') {
            else if (e['data'][0]['call'] === 'README.md') {
                nww_main.prototype.ui_update_info(e['data'][1])
            }
        };
        nww_main.prototype.get_supply();
        window.setInterval(nww_main.prototype.get_supply, 30000);
    };

    function check_state() {
        let _path = window.location.pathname;
        let _d = new Date().getTime()

        if (_path.startsWith("/info")) {
            if (bc_info_update < _d - 3000) {
                nww_main.prototype.get_info()
                bc_info_update = _d
            };

            nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.section_toggle("bexp_inf", false);
        }
        // else if (_path.startsWith("/news")) {
        //         nww_main.prototype.isection_toggle("bexp_bvv", ["bexp_bvv", "bexp_nsv"]);
        //         nww_main.prototype.section_toggle("bexp_news", false);
        // }
        else if (_path.startsWith("/stats")) {
            nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.section_toggle("bexp_stats", false);
        }
        else if (_path.startsWith("/explorer")) {
            nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.section_toggle("bexp_exp", false);
            if (_path === "/explorer/recent-blocks") {
                nww_main.prototype.get_recent_blocks();
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_rb", false);
            }
            else if (_path === "/explorer/recent-transactions") {
                nww_main.prototype.get_recent_transactions();
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_rt", false);
            }
            else if (_path === "/explorer/mempool") {
                nww_main.prototype.get_raw_mempool();
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_mp", false);
            }
            else if (_path.startsWith("/explorer/block/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_block(_p[_p.length - 1])
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_b", false);
            }
            else if (_path.startsWith("/explorer/transaction/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_transaction(_p[_p.length - 1])
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_t", false);
            }
            else if (_path.startsWith("/explorer/address/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_address(_p[_p.length - 1])
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_a", false);
            }
            else if (_path.startsWith("/explorer/mempool/entry")) {
                let _p = _path.split("/")
                nww_main.prototype.get_mempool_entry(_p[_p.length - 1])
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
                nww_main.prototype.exp_section_toggle("exp_m", false);
            }
            else if (_path.startsWith("/explorer/search")) {
                nww_main.prototype.isection_toggle("bexp_bvv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            };
        }
        else if (_path.startsWith("/market")) {
            nww_main.prototype.get_nft_auctions();
            nww_main.prototype.isection_toggle("bmarket", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (_path.startsWith("/search")) {
            nww_main.prototype.isection_toggle("search_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (_path.startsWith("/about")) {
            nww_main.prototype.isection_toggle("about_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (_path === "/") {
            nww_main.prototype.isection_toggle("main_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else {
            let _p = _path.split("/");

            if (_p[_p.length - 1].length > parseInt(_p[_p.length - 1][0]) + 1) {
                nww_main.prototype.get_shortcode(_p[_p.length - 1]);
                nww_main.prototype.isection_toggle("bexp_nsv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            }
            else if (_p[_p.length - 1].startsWith('N') & _p[_p.length - 1].length === 34) {
                nww_main.prototype.get_namespace(_p[_p.length - 1]);
                nww_main.prototype.isection_toggle("bexp_nsv", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            };
        };


        // window.history.replaceState(null, document.title, "/info")
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
        }
    }

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
                }
            }
        };
    };

    nww_main.prototype.section_toggle = function (id, cs = true) {
        let sections = ["bexp_inf", "bexp_stats", "bexp_exp", "bmarket", "main_section", "search_section", "about_section"];
        nww_main.prototype.isection_toggle(id, sections);
        if (id === "bexp_inf") {
            window.history.replaceState(null, document.title, "/info")
        }
        // else if (id === "bexp_news") {
        //     window.history.replaceState(null, document.title, "/news")
        // }
        else if (id === "bexp_stats") {
            window.history.replaceState(null, document.title, "/stats")
        }
        else if (id === "bexp_exp") {
            let _path = window.location.pathname;
            if (!_path.startsWith("/explorer/block/") &
                !_path.startsWith("/explorer/transaction/") &
                !_path.startsWith("/explorer/address/") &
                !_path.startsWith("/explorer/mempool/entry/")) {

                window.history.replaceState(null, document.title, "/explorer");
            };
        }
        else if (id === "bmarket") {
            window.history.replaceState(null, document.title, "/market")
        }
        else if (id === "main_section") {
            window.history.replaceState(null, document.title, "/")
        }
        else if (id === "about_section") {
            window.history.replaceState(null, document.title, "/about")
        }
        else if (id === "search_section") {
            window.history.replaceState(null, document.title, "/search")
        };

        if (cs) {
            check_state();
        };

    };

    nww_main.prototype.exp_section_toggle = function (id, cs = true) {
        let sections = ["exp_rb", "exp_rt", "exp_mp", "exp_b", "exp_t", "exp_a", "exp_m"];
        nww_main.prototype.isection_toggle(id, sections);
        if (id === "exp_rb") {
            window.history.replaceState(null, document.title, "/explorer/recent-blocks")
        }
        else if (id === "exp_rt") {
            window.history.replaceState(null, document.title, "/explorer/recent-transactions")
        }
        else if (id === "exp_mp") {
            window.history.replaceState(null, document.title, "/explorer/mempool")
        };
        if (cs) {
            check_state();
        };
    };

    nww_main.prototype.get_supply = function () {
        let _pl = {};
        _pl['endPoint'] = ep;
        _pl['call'] = 'get_supply';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
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

    nww_main.prototype.ui_update_recent_blocks = function (e) {
        let _uibexp_rb = document.getElementById('uibexp_rb');
        clear_table(_uibexp_rb)

        for (result in e[1]['page_results']) {
            let _bh_lnk = ce('span');
            _bh_lnk.innerText = e[1]['page_results'][result][0];
            _bh_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _bh_lnk.innerText);
            };
            let _b_lnk = ce('span');
            _b_lnk.innerText = e[1]['page_results'][result][1];
            _b_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _b_lnk.innerText);
            };
            let _r = [e[1]['page_results'][result][2], _bh_lnk, _b_lnk, e[1]['page_results'][result][3]]
            add_row(_uibexp_rb, _r);
        }
    };

    nww_main.prototype.ui_update_recent_transactions = function (e) {
        let _uibexp_rt = document.getElementById('uibexp_rt');
        clear_table(_uibexp_rt)

        for (result in e[1]['page_results']) {
            let _tx_lnk = ce('span');
            let tx = e[1]['page_results'][result];
            _tx_lnk.innerText = tx[1]
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', _tx_lnk.innerText);
            };
            let _b_lnk = ce('span');
            _b_lnk.innerText = tx[0];
            _b_lnk.onclick = function () {
                nww_main.prototype.section_link('block', _b_lnk.innerText);
            };
            let _r = [tx[2], _b_lnk, _tx_lnk, tx[3], tx[4], '', '']
            add_row(_uibexp_rt, _r);
        }
    };

    nww_main.prototype.ui_update_mempool = function (e) {
        let _uibexp_rm = document.getElementById('uibexp_rm');
        clear_table(_uibexp_rm)
        if (typeof e == 'object') {
            for (result in e) {
                let _tx_lnk = ce('span');
                _tx_lnk.innerText = e[result];
                _tx_lnk.onclick = function () {
                    nww_main.prototype.section_link('mempool', _tx_lnk.innerText);
                };
                // let _b_lnk = ce('span');
                // _b_lnk.innerText = e[1]['page_results'][result][1];
                // _b_lnk.onclick = function() {
                //     nww_main.prototype.section_link('block', _b_lnk.innerText);
                // };
                let _r = [_tx_lnk]
                add_row(_uibexp_rm, _r);
            }
        }
        else {
            let _tx_lnk = ce('span');
            _tx_lnk.innerText = e;
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('mempool', _tx_lnk.innerText);
            };
            let _r = [_tx_lnk]
            add_row(_uibexp_rm, _r);
        }
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
        _uibs_genreward.innerText = e['genisis_reward']
        _uibs_diff.innerText = rounder(e['difficulty'], '3')
        _uibs_nethash.innerText = rounder(e['networkhashps'], '3')

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

        _height.innerText = 0;
        _hash.innerText = e['blockhash'];

        // let f = JSON.parse(e['header']);
        // console.log('f', f)
        _version.innerText = e['header']['version'];
        // _phash.href = '/explorer/block/' + e['header']['prev_hash'];
        _phash.innerText = e['header']['prev_hash'];
        _phash.onclick = function () {
            nww_main.prototype.section_link('block', e['header']['prev_hash']);
        };
        _merkle.innerText = e['header']['merkle'];
        _time.innerText = e['header']['timestamp'];
        _bits.innerText = e['header']['bits'];
        _nonce.innerText = e['header']['nonce'];
        _extra.innerText = e['header']['extra'];
        _uibexp_betxc.innerText = e['transactions'].length

        for (result in e['transactions']) {
            let r = e['transactions'][result]
            let sats = 0;
            // console.log('result', result)
            for (res in r['vout']) {
                sats += r['vout'][res]['value']
                console.log('sats', sats)
            }
            let _tx_lnk = ce('span');
            // _tx_lnk.href = '/explorer/transaction/' + r['txid'];
            _tx_lnk.innerText = r['txid'];
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', r['txid']);
            };
            add_row(_bt, [_tx_lnk, r['vin'].length, r['vout'].length, sats]);
        }
    };

    nww_main.prototype.ui_update_transaction = function (e) {
        let _id = document.getElementById('uibexp_ti');
        let _hash = document.getElementById('uibexp_th');
        let _locktime = document.getElementById('uibexp_tl');
        let _version = document.getElementById('uibexp_tv');
        let _size = document.getElementById('uibexp_ts');
        let _vsize = document.getElementById('uibexp_tvs');
        let _vin = document.getElementById('uibexp_tin');
        let _vout = document.getElementById('uibexp_tout');
        let _wit = document.getElementById('uibexp_twit');
        clear_table(_vin);
        clear_table(_vout);
        clear_table(_wit);

        _id.innerText = e['txid'];
        _hash.innerText = e['hash'];
        _locktime.innerText = e['locktime'];
        _version.innerText = e['version'];
        _size.innerText = 0;
        _vsize.innerText = 0;

        for (result in e['vin']) {
            // console.log('result', result)
            let _tx_lnk = ce('span');
            let _tx = e['vin'][result]['txid'];
            // _tx_lnk.href = '/explorer/transaction/' + e['vin'][result]['txid'];
            _tx_lnk.innerText = e['vin'][result]['txid'];
            _tx_lnk.onclick = function () {
                nww_main.prototype.section_link('transaction', _tx);
            };
            e['vin'][result]['txid'] = _tx_lnk;
            add_row(_vin, e['vin'][result]);
        }

        for (result in e['vout']) {
            // console.log('result', result)
            let _addr_lnk = ce('span');
            let _addr = e['vout'][result]['script_pubkey'];
            _addr_lnk.innerText = _addr;
            _addr_lnk.onclick = function () {
                nww_main.prototype.section_link('address', _addr);
            };
            e['vout'][result]['script_pubkey'] = _addr_lnk;
            // console.log(e['vout'][result])
            add_row(_vout, e['vout'][result]);
        }
        for (result in e['witness']) {
            // console.log('result', result)
            add_row(_wit, e['witness'][result]);
        }
    };

    nww_main.prototype.ui_update_address = function (e) {
        let _received = document.getElementById('uibexp_ar');
        let _sent = document.getElementById('uibexp_as');
        let _balance = document.getElementById('uibexp_ab');
        let _total_results = document.getElementById('uibexp_att');
        let _recent_tx = document.getElementById('uibexp_art');
        clear_table(_recent_tx)

        _received.innerText = e[0]['received'];
        _sent.innerText = e[0]['sent'];
        _balance.innerText = e[0]['balance'];
        _total_results.innerText = e[1]['total_results'];

        for (result in e[1]['page_results']) {
            // console.log('result', result)
            let r = e[1]['page_results'][result]
            add_row(_recent_tx, ['', r['block'], r['txid'], r['value'], r['direction']]);
        }
    };

    nww_main.prototype.ui_update_mempool_entry = function (e) {
        console.log(e)

        let _mat = document.getElementById('uibexp_mat');
        let _mdt = document.getElementById('uibexp_mdt');
        clear_table(_mat)
        clear_table(_mdt)
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
        let _p = _path.split("/")
        _m.innerText = _p[_p.length - 1]

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
        let _bexp_nsv = document.getElementById('xbexp_nsv');
        let _nsv_c = document.getElementById('nsv_c');
        let nspro_name = document.getElementById('nspro_name');
        let nspro_sc = document.getElementById('nspro_sc');
        let nspro_nsid = document.getElementById('nspro_nsid');
        let nspro_keys = document.getElementById('nspro_keys');
        let nspro_owner = document.getElementById('nspro_owner');
        let name_set = false;

        while (_bexp_nsv.firstChild) {
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };
        let spacer = ce('div')
        spacer.style.marginTop = '-16px'
        _bexp_nsv.appendChild(spacer);
        // <div style="margin-top: -16px;"></div>
        e['data'].reverse()

        nspro_nsid.innerText = e['nsid']
        nspro_sc.innerText = e['root_shortcode']
        nspro_keys.innerText = e['data'].length
        nspro_owner.innerText = e['data'][0]['addr']

        for (result in e['data']) {
            let x = _nsv_c.cloneNode(true);
            // let _nsv_rp = x.querySelector('#nsv_reply'); //document.getElementById('nsv_reply');
            let k = x.querySelector('#nsv_key');
            let t = x.querySelector('#nsv_time');
            let v = x.querySelector('#nsv_value');
            let b = x.querySelector('#nsv_block');
            let txid = x.querySelector('#nsv_txid');
            let a = x.querySelector('#nsv_addr');
            let o = x.querySelector('#nsv_op');
            let rc = x.querySelector('#nsv_rc');
            let replies = x.querySelector('#nsv_replies');
            x.id = 'nsv_k' + e['data'][result]['timestamp']

            k.id = 'nsv_key' + e['data'][result]['timestamp']
            t.id = 'nsv_time' + e['data'][result]['timestamp']
            v.id = 'nsv_value' + e['data'][result]['timestamp']
            b.id = 'nsv_block' + e['data'][result]['timestamp']
            txid.id = 'nsv_txid' + e['data'][result]['timestamp']
            a.id = 'nsv_addr' + e['data'][result]['timestamp']
            o.id = 'nsv_op' + e['data'][result]['timestamp']
            rc.id = 'nsv_rc' + e['data'][result]['timestamp']
            k.innerText = e['data'][result]['key']
            t.innerText = e['data'][result]['time']

            if (e['data'][result]['key'] === 'html') {
                v.innerText = '';
                let ifra = ce('iframe');
                ifra.srcdoc = e['data'][result]['value'];
                ifra.style.cssText = 'width: 200%; height: 200vh; -webkit-transform: scale(.5); transform: scale(.5); -webkit-transform-origin: 0 0; transform-origin: 0 0;'
                v.appendChild(ifra);
            }
            else {
                v.innerText = e['data'][result]['value']
            }

            let kb = e['data'][result]['key_shortcode']
            b.onclick = function () {
                nww_main.prototype.section_link('block', kb);
            };
            b.innerText = e['data'][result]['key_shortcode']
            let ktxid = e['data'][result]['txid']
            txid.onclick = function () {
                nww_main.prototype.section_link('transaction', ktxid);
            };
            // txid.innerText = e['data'][result]['txid']
            a.innerText = e['data'][result]['addr']
            o.innerText = e['data'][result]['op']
            rc.innerText = e['data'][result]['replies'].length
            if (e['data'][result]['replies'].length >= 1) {
                replies.className += " w3-show";
            }
            if (!name_set) {
                if (e['data'][result]['key'].endsWith('_KEVA_NS_')) {
                    try {
                        let nn = JSON.parse(e['data'][result]['value']);
                        nspro_name.innerText = nn['displayName'];
                        name_set = true;
                    }
                    catch {
                        nspro_name.innerText = e['data'][result]['value'];
                        name_set = true;
                    };
                };
            };
            for (rresult in e['data'][result]['replies']) {
                let _nsv_rp = document.getElementById('nsv_reply');
                let rx = _nsv_rp.cloneNode(true);
                let rsc = rx.querySelector('#nsv_rsc');
                let rt = rx.querySelector('#nsv_rtime');
                let rv = rx.querySelector('#nsv_rvalue');
                let rb = rx.querySelector('#nsv_rblock');
                let rtxid = rx.querySelector('#nsv_rtxid');
                let ra = rx.querySelector('#nsv_raddr');
                let ro = rx.querySelector('#nsv_rop');
                // let rrc = rx.querySelector('#nsv_rrc');
                // console.log(rresult)
                rx.id = 'nsv_rk' + e['data'][result]['replies'][rresult]['timestamp']

                // k.id = 'nsv_rkey' + e['data'][result]['timestamp']
                rt.id = 'nsv_rtime' + e['data'][result]['replies'][rresult]['timestamp']
                rv.id = 'nsv_rvalue' + e['data'][result]['replies'][rresult]['timestamp']
                rb.id = 'nsv_rblock' + e['data'][result]['replies'][rresult]['timestamp']
                rtxid.id = 'nsv_rtxid' + e['data'][result]['replies'][rresult]['timestamp']
                ra.id = 'nsv_raddr' + e['data'][result]['replies'][rresult]['timestamp']
                ro.id = 'nsv_rop' + e['data'][result]['replies'][rresult]['timestamp']
                // rrc.id = 'nsv_rrc' + e['data'][result]['replies'][rresult]['timestamp']
                // k.innerText = e['data'][result]['key']
                rt.innerText = e['data'][result]['replies'][rresult]['time']
                let rtype = e['data'][result]['replies'][rresult]['type']
                let rtm = ''

                rv.innerText = e['data'][result]['replies'][rresult]['value'] + rtm
                if (rtype === 'reward') {
                    rtm = ' love'
                    rv.innerText = rv.innerText + rtm
                }
                else if (rtype === 'repost') {
                    rv.innerText = 'Reposted'
                }


                rb.innerText = e['data'][result]['replies'][rresult]['key_shortcode']
                let rtsc = e['data'][result]['replies'][rresult]['root_shortcode']
                rsc.innerText = rtsc
                rsc.onclick = function () {
                    nww_main.prototype.section_link('shortcode', rsc.innerText);
                };
                let rrtxid = e['data'][result]['replies'][rresult]['txid']
                rtxid.onclick = function () {
                    nww_main.prototype.section_link('transaction', rrtxid);
                };
                ra.innerText = e['data'][result]['replies'][rresult]['addr']
                ro.innerText = e['data'][result]['replies'][rresult]['op']

                replies.appendChild(rx);
            };
            _bexp_nsv.appendChild(x);
        };
        // bexp_nsv.innerText = e;

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
            _bexp_nsv.removeChild(_bexp_nsv.firstChild);
        };
        let spacer = ce('div')
        spacer.style.marginTop = '-16px'
        _bexp_nsv.appendChild(spacer);
        // <div style="margin-top: -16px;"></div>
        e['data'].reverse()

        // nspro_nsid.innerText = e['nsid']
        nspro_sc.innerText = e['len']
        // nspro_keys.innerText = e['data'].length
        // nspro_owner.innerText = e['data'][0]['addr']

        for (result in e['data']) {
            let x = _nsv_c.cloneNode(true);
            // let _nsv_rp = x.querySelector('#nsv_reply'); //document.getElementById('nsv_reply');
            let k = x.querySelector('#mnsv_key');
            let kp = x.querySelector('#mnsv_keyp');
            let krc = x.querySelector('#mnsv_keyrc');
            let krh = x.querySelector('#mnsv_keyrh');
            let t = x.querySelector('#mnsv_time');
            let v = x.querySelector('#mnsv_value');
            let b = x.querySelector('#mnsv_block');
            let txid = x.querySelector('#mnsv_txid');
            let a = x.querySelector('#mnsv_addr');
            let o = x.querySelector('#mnsv_op');
            let rc = x.querySelector('#mnsv_rc');
            // let aucsc = x.querySelector('#mnsv_aucsc');
            let replies = x.querySelector('#mnsv_replies');
            x.id = 'mnsv_k' + e['data'][result]['timestamp']
            k.id = 'mnsv_key' + e['data'][result]['timestamp']
            t.id = 'mnsv_time' + e['data'][result]['timestamp']
            v.id = 'mnsv_value' + e['data'][result]['timestamp']
            b.id = 'mnsv_block' + e['data'][result]['timestamp']
            txid.id = 'mnsv_txid' + e['data'][result]['timestamp']
            a.id = 'mnsv_addr' + e['data'][result]['timestamp']
            o.id = 'mnsv_op' + e['data'][result]['timestamp']
            rc.id = 'mnsv_rc' + e['data'][result]['timestamp']
            // aucsc.id = 'mnsvaucsc' + e['data'][result]['root_shortcode']
            // let _auc = JSON.parse(e['data'][result]['value'])
            
            kp.innerText = e['data'][result]['price']
            t.innerText = e['data'][result]['time']

            v.innerText = e['data'][result]['desc']
            let rsc = e['data'][result]['root_shortcode']
            k.innerText = '@' + rsc + ' - ' + e['data'][result]['displayName'];
            // aucsc.innerText = '@' + rsc
            k.onclick = function () {
                nww_main.prototype.section_link('shortcode', rsc);
            };
            // let kb = e['data'][result]['key_shortcode']
            // b.onclick = function () {
            //     nww_main.prototype.section_link('block', kb);
            // };
            // b.innerText = e['data'][result]['key_shortcode']
            let ktxid = e['data'][result]['txid']
            txid.onclick = function () {
                nww_main.prototype.section_link('transaction', ktxid);
            };
            // txid.innerText = e['data'][result]['txid']
            a.innerText = e['data'][result]['owner_addr']
            // o.innerText = e['data'][result]['op']
            // if (e['data'][result]['bids'].length > 0) {
            // console.log(e['data'][result])}
            // let bidc = e['data'][result]['bids'].length
            krc.innerText = e['data'][result]['bids'].length
            // if (e['data'][result]['bids'].length >= 1) {
            //     replies.className += " w3-show";
            // }


            // if (!name_set) {
            //     if (e['data'][result]['key'].endsWith('_KEVA_NS_')) {
            //         try {
            //             let nn = JSON.parse(e['data'][result]['value']);
            //             nspro_name.innerText = nn['displayName'];
            //             name_set = true;
            //         }
            //         catch {
            //             nspro_name.innerText = e['data'][result]['value'];
            //         name_set = true;
            //         };
            //     };
            // };


            // krc.innerText = e['data'][result]['bids'].length;
            _high_bid = 0;
            // for (rresult in e['data'][result]['bids']) {
            //     let _nsv_rp = document.getElementById('mnsv_reply');
            //     let rx = _nsv_rp.cloneNode(true);
            //     let rsc = rx.querySelector('#mnsv_rsc');
            //     let rt = rx.querySelector('#mnsv_rtime');
            //     let rv = rx.querySelector('#mnsv_rvalue');
            //     let rb = rx.querySelector('#mnsv_rblock');
            //     let rtxid = rx.querySelector('#mnsv_rtxid');
            //     let ra = rx.querySelector('#mnsv_raddr');
            //     let ro = rx.querySelector('#mnsv_rop');
            //     // let rrc = rx.querySelector('#nsv_rrc');
            //     // console.log(rresult)
            //     rx.id = 'mnsv_rk' + e['data'][result]['bids'][rresult]['timestamp']

            //     // k.id = 'nsv_rkey' + e['data'][result]['timestamp']
            //     rt.id = 'mnsv_rtime' + e['data'][result]['bids'][rresult]['timestamp']
            //     rv.id = 'mnsv_rvalue' + e['data'][result]['bids'][rresult]['timestamp']
            //     rb.id = 'mnsv_rblock' + e['data'][result]['bids'][rresult]['timestamp']
            //     rtxid.id = 'mnsv_rtxid' + e['data'][result]['bids'][rresult]['timestamp']
            //     ra.id = 'mnsv_raddr' + e['data'][result]['bids'][rresult]['timestamp']
            //     ro.id = 'mnsv_rop' + e['data'][result]['bids'][rresult]['timestamp']
            //     // rrc.id = 'nsv_rrc' + e['data'][result]['replies'][rresult]['timestamp']
            //     // k.innerText = e['data'][result]['key']
            //     rt.innerText = e['data'][result]['bids'][rresult]['time']
            //     let rtype = e['data'][result]['bids'][rresult]['type']
            //     let rtm = ''

            //     rv.innerText = e['data'][result]['bids'][rresult]['value'] + rtm
            //     if (rtype === 'reward') {
            //         rtm = ' love'
            //         rv.innerText = rv.innerText + rtm
            //     }
            //     else if (rtype === 'repost') {
            //         rv.innerText = 'Reposted'
            //     }


            //     rb.innerText = e['data'][result]['bids'][rresult]['key_shortcode']
            //     let rtsc = e['data'][result]['bids'][rresult]['root_shortcode']
            //     rsc.innerText = rtsc
            //     rsc.onclick = function () {
            //         nww_main.prototype.section_link('shortcode', rsc.innerText);
            //     };
            //     let rrtxid = e['data'][result]['bids'][rresult]['txid']
            //     rtxid.onclick = function () {
            //         nww_main.prototype.section_link('transaction', rrtxid);
            //     };
            //     ra.innerText = e['data'][result]['bids'][rresult]['addr']
            //     ro.innerText = e['data'][result]['bids'][rresult]['op']

            //     replies.appendChild(rx);
            // };
            krh.innerText = _high_bid
            _bexp_nsv.appendChild(x);
        };
        // bexp_nsv.innerText = e;

    };

    nww_main.prototype.section_link = function (section, value) {
        if (section === 'block') {
            nww_main.prototype.section_toggle("bexp_exp", false);
            nww_main.prototype.isection_toggle("bexp_bvv", ["bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.get_block(value);
            window.history.replaceState(null, document.title, "/explorer/block/" + value)
            nww_main.prototype.exp_section_toggle("exp_b", false);
        }
        else if (section === 'transaction') {
            nww_main.prototype.section_toggle("bexp_exp", false);
            nww_main.prototype.isection_toggle("bexp_bvv", ["bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.get_transaction(value);
            window.history.replaceState(null, document.title, "/explorer/transaction/" + value)
            nww_main.prototype.exp_section_toggle("exp_t", false);
        }
        else if (section === 'address') {
            nww_main.prototype.section_toggle("bexp_exp", false);
            nww_main.prototype.isection_toggle("bexp_bvv", ["bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.get_address(value);
            window.history.replaceState(null, document.title, "/explorer/address/" + value)
            nww_main.prototype.exp_section_toggle("exp_a", false);
        }
        else if (section === 'mempool') {
            nww_main.prototype.section_toggle("bexp_exp", false);
            nww_main.prototype.isection_toggle("bexp_bvv", ["bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.get_mempool_entry(value);
            window.history.replaceState(null, document.title, "/explorer/mempool/entry/" + value)
            nww_main.prototype.exp_section_toggle("exp_m", false);
        }
        else if (section === 'shortcode') {
            nww_main.prototype.section_toggle("bexp_nsv", false);
            nww_main.prototype.isection_toggle("bexp_nsv", ["bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
            nww_main.prototype.get_shortcode(value);
            window.history.replaceState(null, document.title, "/" + value)
        }
        else if (section == '/market') {
            nww_main.prototype.get_nft_auctions();
            window.history.replaceState(null, document.title, '/market')
            nww_main.prototype.isection_toggle("bmarket", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (section == 'about') {
            window.history.replaceState(null, document.title, '/about')
            nww_main.prototype.isection_toggle("about_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (section == 'search') {
            window.history.replaceState(null, document.title, '/search')
            nww_main.prototype.isection_toggle("search_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        }
        else if (section == 'home') {
            window.history.replaceState(null, document.title, '/')
            nww_main.prototype.isection_toggle("main_section", ["bmarket", "bexp_bvv", "bexp_nsv", "main_section", "search_section", "about_section"]);
        };
    };

    nww_main.prototype.search = function () {
        // get_block
        let _search = document.getElementById('uibssrc');
        let sc = false;
        let _sv = Number(_search.value)
        if (_sv >= 0 & _search.value.length <= 16) {
            let _height = document.getElementById('uibs_height');

            if (_sv <= parseInt(_height.innerText) & _sv >= 0) {
                console.log(typeof _sv, _sv, '_sv might be block')
            };

            if (_search.value.length > parseInt(_search.value[0]) + 1) {
                if (parseInt(_height.innerText) > _search.value.slice(1, parseInt(_search.value[0]) + 1)) {
                    console.log(typeof _sv, _sv, '_sv might be shortcode')
                    // sc = true;
                };
            };
            if (!sc) {
                nww_main.prototype.get_block(_sv);
                window.history.replaceState(null, document.title, "/explorer/block/" + _sv)
                nww_main.prototype.exp_section_toggle("exp_b", false);
            }
        }
        else if (_search.value.length === 64) {
            console.log(typeof _sv, _sv, '_sv might be blockhash / txhash')
        }
        else if (_search.value.length === 34) {
            console.log(typeof _sv, _sv, '_sv might be address / namespace')
            if (!sc) {
                nww_main.prototype.get_address(_search.value);
                window.history.replaceState(null, document.title, "/explorer/address/" + _search.value)
                nww_main.prototype.exp_section_toggle("exp_a", false);
            }
        }
        console.log(typeof _sv, _sv, _search.value.length, _search.value.slice(1, parseInt(_search.value[0]) + 1))
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

    function clear_table(table) {
        let tableHeaderRowCount = 1;
        let rowCount = table.rows.length;
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        };
    };

    function rounder(number, places) {
        return +(Math.round(number + 'e+'.concat(places)) + 'e-'.concat(places));
    };

    return new nww_main();

});