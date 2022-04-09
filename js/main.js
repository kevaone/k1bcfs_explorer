var nww_main = new (function () {
    let Q = new Worker('/js/worker.js');
    let modal = document.getElementById('modal-main');
    let modal_body = document.getElementById('modal-body');
    let modal_close = document.getElementById('modal-close');
    let modal_cancel = document.getElementById('modal-cancel');
    let modal_submit = document.getElementById('modal-submit');
    let ep = 'https://kva.keva.one/'

    let bc_general_update = 0;
    let bc_info_update = 0;
    let bc_news_update = 0;
    let bc_recent_blocks_update = 0;
    let bc_recent_transactions_update = 0;
    let bc_general_vis = true;
    let bc_info_vis = false;
    let bc_news_vis = false;
    let bc_stats_vis = false;
    let bc_explorer_vis = false;
    let bc_explorer_recent_blocks_vis = false;
    let bc_explorer_recent_transactions_vis = false;
    let bc_explorer_mempool_vis = false;
    let bc_explorer_block_vis = false;
    let bc_explorer_transaction_vis = false;
    let bc_explorer_address_vis = false;

    function nww_main() {
        //console.log('main');
        check_state();
        check_for_auction();

        modal_close.onclick = function () {
            modal.style.display = 'none';
            clear_modal();
        };

        modal_cancel.onclick = function () {
            modal.style.display = 'none';
            clear_modal();
        };

        modal_submit.onclick = function () {
            nww_main.prototype.action();
            modal.style.display = 'none';
            clear_modal();
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                clear_modal();
            };
        };

        Q.onmessage = function (e) {
            console.log('Message received from worker', e['data']);
            if (e['data'][0]['call'] === 'get_supply') {
                nww_main.prototype.ui_update_supply(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_block') {
                nww_main.prototype.ui_update_block(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_block_hash') {
                nww_main.prototype.ui_update_block(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_transaction') {
                nww_main.prototype.ui_update_transaction(e['data'][1])
            }
            else if (e['data'][0]['call'] === 'get_address') {
                nww_main.prototype.ui_update_address(e['data'][1])
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
            if (!bc_info_vis) {
                nww_main.prototype.section_toggle("bexp_inf", false);
                bc_info_vis = true;
                bc_news_vis = false;
                bc_stats_vis = false;
                bc_explorer_vis = false;
            }
        }
        else if (_path.startsWith("/news")) {
            if (!bc_news_vis) {
                nww_main.prototype.section_toggle("bexp_news", false);
                bc_info_vis = false;
                bc_news_vis = true;
                bc_stats_vis = false;
                bc_explorer_vis = false;
            };
        }
        else if (_path.startsWith("/stats")) {
            if (!bc_stats_vis) {
                nww_main.prototype.section_toggle("bexp_stats", false);
                bc_info_vis = false;
                bc_news_vis = false;
                bc_stats_vis = true;
                bc_explorer_vis = false;
            };
        }
        else if (_path.startsWith("/explorer")) {
            if (!bc_explorer_vis) {
                nww_main.prototype.section_toggle("bexp_exp", false);
                bc_info_vis = false;
                bc_news_vis = false;
                bc_stats_vis = false;
                bc_explorer_vis = true;
            };
            if (_path === "/explorer/recent-blocks") {
                if (!bc_explorer_recent_blocks_vis) {
                    nww_main.prototype.exp_section_toggle("exp_rb", false);
                    bc_explorer_recent_blocks_vis = true;
                    bc_explorer_recent_transactions_vis = false;
                    bc_explorer_mempool_vis = false;
                    bc_explorer_block_vis = false;
                    bc_explorer_transaction_vis = false;
                    bc_explorer_address_vis = false;
                };
            }
            else if (_path === "/explorer/recent-transactions") {
                if (!bc_explorer_recent_transactions_vis) {
                    nww_main.prototype.exp_section_toggle("exp_rt", false);
                    bc_explorer_recent_blocks_vis = false;
                    bc_explorer_recent_transactions_vis = true;
                    bc_explorer_mempool_vis = false;
                    bc_explorer_block_vis = false;
                    bc_explorer_transaction_vis = false;
                    bc_explorer_address_vis = false;
                };
            }
            else if (_path === "/explorer/mempool") {
                if (!bc_explorer_mempool_vis) {
                    nww_main.prototype.exp_section_toggle("exp_mp", false);
                    bc_explorer_recent_blocks_vis = false;
                    bc_explorer_recent_transactions_vis = false;
                    bc_explorer_mempool_vis = true;
                    bc_explorer_block_vis = false;
                    bc_explorer_transaction_vis = false;
                    bc_explorer_address_vis = false;
                };
            }
            else if (_path.startsWith("/explorer/block/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_block(_p[_p.length-1])
                if (!bc_explorer_block_vis) {
                    nww_main.prototype.exp_section_toggle("exp_b", false);
                    bc_explorer_recent_blocks_vis = false;
                    bc_explorer_recent_transactions_vis = false;
                    bc_explorer_mempool_vis = false;
                    bc_explorer_block_vis = true;
                    bc_explorer_transaction_vis = false;
                    bc_explorer_address_vis = false;
                };
            }
            else if (_path.startsWith("/explorer/transaction/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_transaction(_p[_p.length-1])
                if (!bc_explorer_transaction_vis) {
                    nww_main.prototype.exp_section_toggle("exp_t", false);
                    bc_explorer_recent_blocks_vis = false;
                    bc_explorer_recent_transactions_vis = false;
                    bc_explorer_mempool_vis = false;
                    bc_explorer_block_vis = false;
                    bc_explorer_transaction_vis = true;
                    bc_explorer_address_vis = false;
                };
            }
            else if (_path.startsWith("/explorer/address/")) {
                let _p = _path.split("/")
                nww_main.prototype.get_address(_p[_p.length-1])
                if (!bc_explorer_address_vis) {
                    nww_main.prototype.exp_section_toggle("exp_a", false);
                    bc_explorer_recent_blocks_vis = false;
                    bc_explorer_recent_transactions_vis = false;
                    bc_explorer_mempool_vis = false;
                    bc_explorer_block_vis = false;
                    bc_explorer_transaction_vis = false;
                    bc_explorer_address_vis = true;
                };
            }
            else if (_path.startsWith("/explorer/search")) {

            };

            //     nww_main.prototype.get_address('VMw8Xj3FvJVDhyBfaomtq84fkFWg4xFCGc')
            // nww_main.prototype.update_recentblocks(e['block_height'])
            // nww_main.prototype.get_block(220550)
            // nww_main.prototype.get_info()
            // nww_main.prototype.get_transaction('6b71f4be495a06d1e03b3deaa090b8ff9763c2ce01416e1a8f6b6fd92d4dbae1')
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
        // let sections = ["bexp_inf", "bexp_news", "bexp_stats", "bexp_exp"];
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
        let sections = ["bexp_inf", "bexp_news", "bexp_stats", "bexp_exp"];
        nww_main.prototype.isection_toggle(id, sections);
        if (id === "bexp_inf") {
            window.history.replaceState(null, document.title, "/info")
        }
        else if (id === "bexp_news") {
            window.history.replaceState(null, document.title, "/news")
        }
        else if (id === "bexp_stats") {
            window.history.replaceState(null, document.title, "/stats")
        }
        else if (id === "bexp_exp") {
            let _path = window.location.pathname;
            if (!_path.startsWith("/explorer/block/") &
                !_path.startsWith("/explorer/transaction/") &
                !_path.startsWith("/explorer/address/")) {

                    window.history.replaceState(null, document.title, "/explorer");
            };
        };
        if (cs) {
            check_state();
        };

    };

    nww_main.prototype.exp_section_toggle = function (id, cs = true) {
        let sections = ["exp_rb", "exp_rt", "exp_mp", "exp_b", "exp_t", "exp_a"];
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
        console.log('e.length', e.length)
        if (e.length === 64) {
            _pl['call'] = 'get_block_hash';
            _pl['call_data'] = e;
        } else {
            _pl['call'] = 'get_block';
            _pl['call_data'] = parseInt(e);
        }

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

    nww_main.prototype.get_info = function (e) {
        let _pl = {};
        _pl['endPoint'] = 'https://raw.githubusercontent.com/kevacoin-project/kevacoin/master/';
        _pl['call'] = 'README.md';
        // _pl['endPoint'] = ep;
        // _pl['call'] = 'get_info';
        _pl['type'] = 'GET';
        Q.postMessage(_pl);
    };

    nww_main.prototype.update_recentblocks = function (e) {

        let _uibexp_rb = document.getElementById('uibexp_rb');
        clear_table(_uibexp_rb)


        // console.log(_uibexp_rb.childNodes[3].childElementCount)
        // let _pl = {};
        // _pl['endPoint'] = ep;
        // _pl['call'] = 'get_supply';
        // _pl['type'] = 'GET';
        // Q.postMessage(_pl);
    };

    nww_main.prototype.ui_update_supply = function (e) {
        let _height = document.getElementById('uibs_height');
        let _supply = document.getElementById('uibs_supply');
        let _fees = document.getElementById('uibs_fees');
        let _uibs_genreward = document.getElementById('uibs_genreward');

        _height.innerText = e['block_height'];
        _supply.innerText = e['coin_supply'];
        _fees.innerText = e['fees_payed'];
        _uibs_genreward.innerText = e['genisis_reward']
        // nww_main.prototype.get_address('VMw8Xj3FvJVDhyBfaomtq84fkFWg4xFCGc')
        // nww_main.prototype.update_recentblocks(e['block_height'])
        // nww_main.prototype.get_block(220550)
        // nww_main.prototype.get_info()
        // nww_main.prototype.get_transaction('6b71f4be495a06d1e03b3deaa090b8ff9763c2ce01416e1a8f6b6fd92d4dbae1')

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
        _phash.onclick = function() {
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
            _tx_lnk.onclick = function() {
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
            _tx_lnk.onclick = function() {
                nww_main.prototype.section_link('transaction', _tx);
            };
            e['vin'][result]['txid'] = _tx_lnk;
            add_row(_vin, e['vin'][result]);
        }

        for (result in e['vout']) {
            // console.log('result', result)
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

        // "page": 1,
        // "pages": 1,

        for (result in e[1]['page_results']) {
            // console.log('result', result)
            let r = e[1]['page_results'][result]
            // block": 455557,
            //     "txid": "6b71f4be495a06d1e03b3deaa090b8ff9763c2ce01416e1a8f6b6fd92d4dbae1:0",
            //     "value": 0.01,
            //     "spent_block": 461365,
            //     "spent_txid": "a3f87087e417545f76294c13478309015077244fcc1d1fc989981da7e73749bd:0",
            //     "direction":
            add_row(_recent_tx, ['', r['block'], r['txid'], r['value'], r['direction']]);
        }
        // "page_results": [
        //     {
        //         "block": 455557,
        //         "txid": "6b71f4be495a06d1e03b3deaa090b8ff9763c2ce01416e1a8f6b6fd92d4dbae1:0",
        //         "value": 0.01,
        //         "spent_block": 461365,
        //         "spent_txid": "a3f87087e417545f76294c13478309015077244fcc1d1fc989981da7e73749bd:0",
        //         "direction": "Receive"
        //     },
        //     {
        //         "block": 461365,
        //         "txid": "a3f87087e417545f76294c13478309015077244fcc1d1fc989981da7e73749bd:0",
        //         "value": 0.01,
        //         "received_block": 455557,
        //         "recevied_txid": "6b71f4be495a06d1e03b3deaa090b8ff9763c2ce01416e1a8f6b6fd92d4dbae1:0",
        //         "direction": "Send"
        //     }
        // ]
    };

    nww_main.prototype.ui_update_info = function (e) {
        let _received = document.getElementById('bexp_inftext');

        _received.innerText = e;

    };

    nww_main.prototype.section_link = function (section, value) {
        if (section === 'block') {
            nww_main.prototype.get_block(value);
            window.history.replaceState(null, document.title, "/explorer/block/" + value)
            nww_main.prototype.exp_section_toggle("exp_b", false);
        }
        else if (section === 'transaction') {
            nww_main.prototype.get_transaction(value);
            window.history.replaceState(null, document.title, "/explorer/transaction/" + value)
            nww_main.prototype.exp_section_toggle("exp_t", false);
        }
        else if (section === 'address') {
            nww_main.prototype.get_address(value);
            window.history.replaceState(null, document.title, "/explorer/address/" + value)
            nww_main.prototype.exp_section_toggle("exp_a", false);
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

    nww_main.prototype.action_modal = function (action_type, tx) {
        build_modal(action_type, tx);
        modal.style.display = 'block';
    };

    nww_main.prototype.action = function () {
        let _data = document.getElementById('modal-action-data');
        let _ref = document.getElementById('modal-action-ref').value.split(':');
        if (_ref[0] != 'share') {
            let _pl = {};
            _pl['endPoint'] = _ref[0];
            console.log('_ref[0]', _ref[0]);
            console.log('_data.value', _data.value);
            _pl['data'] = { 'date': Date.now(), 'data': _data.value, 'tx': _ref[1] };
            Q.postMessage(_pl);
        };
    };

    ce = function (e) {
        let r_e = document.createElement(e);
        return r_e;
    };
    add_row = function (t, e) {
        let _row = ce('tr');
        function add_cell(_row, e) {
            let _cell = ce('td');
            if (typeof e === 'object'){
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
        // add_cell(_row, '');
        // add_cell(_row, e['block']);
        // add_cell(_row, e['txid']);
        // add_cell(_row, e['value']);
        // add_cell(_row, e['direction']);
        t.appendChild(_row);
    };

    function clear_table(table) {
        let tableHeaderRowCount = 1;
        let rowCount = table.rows.length;
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        };
    };

    function check_for_auction() {
        let _keys = document.querySelectorAll('[id^="rs-title-"]');
        if (_keys.length > 0) {
            if (_keys[0].innerHTML === 'NFT Auction') {
                let _data = document.getElementById('rs-actions');
                let d1 = ce('div');
                let i1 = ce('i');
                let _id = _keys[0].id.split('-')[2]
                d1.classList.add('vd');
                i1.classList.add('fas');
                i1.classList.add('fa-comment-dollar');
                d1.appendChild(i1);
                _data.appendChild(d1);
                d1.setAttribute('onclick', 'nww_main.action_modal(\'bid\', \'' + _id + '\');');
            };
        };
    };

    function _clear_modal(section) {
        while (section.hasChildNodes()) {
            section.removeChild(section.firstChild);
        };
    };

    function clear_modal() {
        let modal_header_content = document.getElementById('modal-header-content');
        _clear_modal(modal_header_content);
        _clear_modal(modal_body);
    };

    function build_modal(action_type, tx) {
        let modal_header_text = document.getElementById('modal-header-content');
        let title_key = document.getElementById('rs-title-' + tx)
        let d1 = ce('div');
        let d2 = ce('div');
        let d3 = ce('div');
        let d4 = ce('div');
        let h = ce('h2')
        let hi = ce('i')
        hi.classList.add('fas')
        let s1 = ce('h3');
        let s2 = ce('span');
        let inp1 = undefined
        let inp2 = ce('input');
        inp2.type = 'hidden';
        inp2.value = action_type + ':' + tx;

        s1.innerText = title_key.innerText;

        if (action_type === 'reward') {
            inp1 = ce('input');
            inp1.type = 'text';
            h.innerText = 'Reward';
            hi.classList.add('fa-heart')
            s2.innerText = 'Reward Amount:';
            inp1.placeholder = '0';
        }
        else if (action_type === 'comment') {
            inp1 = ce('textarea');
            inp1.rows = 8
            inp1.cols = 35
            h.innerText = 'Comment';
            hi.classList.add('fa-comment-dots')
            s2.innerText = 'Comment:';
            inp1.placeholder = 'Comment';
        }
        else if (action_type === 'repost') {
            inp1 = ce('textarea');
            inp1.rows = 8
            inp1.cols = 35
            h.innerText = 'Repost';
            hi.classList.add('fa-retweet')
            s2.innerText = 'Repost:';
            inp1.placeholder = 'Repost';
        }
        else if (action_type === 'share') {
            inp1 = ce('textarea');
            h.innerText = 'Share';
            hi.classList.add('fa-external-link-alt')
            s2.innerText = 'Share:';
        }
        else if (action_type === 'bid') {
            inp1 = ce('input');
            inp1.type = 'text';
            inp1.placeholder = '0';
            h.innerText = 'Bid';
            hi.classList.add('fa-comment-dollar')
            s2.innerText = 'Bid Amount:';
        };

        inp1.id = 'modal-action-data';
        inp2.id = 'modal-action-ref';

        d1.appendChild(s1);
        d4.appendChild(hi);
        d4.appendChild(h);
        modal_header_text.appendChild(d4);
        modal_header_text.appendChild(d1);
        d2.appendChild(s2);
        d3.appendChild(inp1);
        d3.appendChild(inp2);

        modal_body.appendChild(d2);
        modal_body.appendChild(d3);
    };

    return new nww_main();

});