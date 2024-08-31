document.write('<table id="excel">');
for (let i = 0; i < 10; i++) {
    document.write('<tr>');
    for (let j = 0; j < 10; j++) {
        if (i == 0 && j != 0)
            document.write('<td>', String.fromCharCode(64 + j), '</td>');
        else if (i != 0 && j == 0)
            document.write('<td>', i, '</td>');
        else
            document.write('<td', ((i != 0 && j != 0) ? ' contenteditable="true"' : ''), '>', '</td>');
    }
    document.write('</tr>');
}
document.write('</table>');
function parseExpression(text) {
    let acm=[], norm=true;
    while(text.length>1){
        let cell=text.slice(0,2);
        if(/[a-i,A-I][1-9]/.test(cell)) acm.push(cell);
        else {norm=false;break;}
        text = text.slice(2);
        if(text && ~'+-*/'.indexOf(text[0])) {
            acm.push(text[0]);
            text = text.slice(1);
        }
    }
    if (norm) {
        let aBase = 'a'.charCodeAt()-1;
        for (let i=0; i<acm.length; i+=2) {
            acm[i] = document.querySelector('#excel').rows[+acm[i][1]].cells[acm[i][0].toLowerCase().charCodeAt() - aBase].textContent;
        }
        return eval(acm.join(''));
    }
}
window.onload = function () {
    let cells = document.querySelectorAll('#excel tr:not(:first-child) td:not(:first-child)');
    for (let cell of cells) {
        cell.addEventListener('focus', function (evt) {
            let text = evt.target.getAttribute('expr');
            if (text && text[0]=='=') {
                evt.target.textContent = text;
            }
        });
        cell.addEventListener('blur', function (evt) {
            let text = evt.target.textContent;
            if (text && text[0]=='=') {
                evt.target.setAttribute('expr', text);
                let val = parseExpression(text.slice(1));
                val && (evt.target.textContent = val);
            }
        });
    }
}