new (function wt() {
    self.addEventListener('message', function (e) { w(e.data); }, false);

    function c(response) { self.postMessage(response); };

    async function w(e) {
        let x = new XMLHttpRequest();
        x.onreadystatechange = function () {
            let r = this.readyState;
            let s = this.status;
            if (r == 4 && s == 200) { c([e, JSON.parse(this.responseText)]); }
            else if (r == 4 && s >= 400) { console.log(this.responseText); c([e, JSON.parse(this.responseText)]); }
            else if (r == 4 && s >= 500) { console.log(this.responseText); c([e, JSON.parse(this.responseText)]); }
        };
        if ('call_data' in e) {
            x.open(e['type'], e['endPoint']+e['call']+'/'+e['call_data'], true);
        } else {
            x.open(e['type'], e['endPoint']+e['call'], true);
        }
        //x.setRequestHeader('Authorization', e['auth']);
        x.setRequestHeader('Access-Control-Allow-Origin', '*');
        //x.setRequestHeader('Content-type', 'application/json');
        x.setRequestHeader('Content-type', 'text/plain');
        if (e['type'] === 'GET') {
            x.send();
        }
        else if (e['type'] === 'POST') {
            x.send(JSON.stringify(e['data']));
        }
        else {
            console.log('Error', e['type'])
        }
        
    };
});