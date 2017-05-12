var React = require('react');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.fields = {"a1": "","a2": "","a3": "","b1": "","b2": "",
                       "b3": "","c1": "","c2": "","c3": ""};
        this.status = {"sign": "X", "turn": "Player1", "message": ""};
        this.history = [];
        this.score = {"player1": 0, "player2": 0, "draw": 0}
        this.combinations = [
            ["a1", "a2", "a3"],
            ["b1", "b2", "b3"],
            ["c1", "c2", "c3"],
            ["a1", "b1", "c1"],
            ["a2", "b2", "c2"],
            ["a3", "b3", "c3"],
            ["a1", "b2", "c3"],
            ["a3", "b2", "c1"]
        ];
        this.initial = this.initial.bind(this);
        this.setupOppo = this.setupOppo.bind(this);
        this.goBack = this.goBack.bind(this);
        this.setupTurn = this.setupTurn.bind(this);
        this.makeChoice = this.makeChoice.bind(this);
        this.changeTurn = this.changeTurn.bind(this);
        this.compAction = this.compAction.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.toggleMessage = this.toggleMessage.bind(this);
        this.clearBoard = this.clearBoard.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }
    initial() {
        this.status = {"sign": "X", "turn": "Player1", "message": ""};
        for (var key of Object.keys(this.fields)) {
            this.fields[key] = "";
        }
        this.history = [];
    }
    setupOppo(e) {
        this.comp = (e.target.innerText === "Computer") ? true : false;
        document.getElementById('choiceplayer').classList.add('dispnone');
        document.getElementById('choicesign').classList.remove('dispnone');
    }
    goBack() {
        document.getElementById('choicesign').classList.add('dispnone');
        document.getElementById('choiceplayer').classList.remove('dispnone');
    }
    setupTurn(e) {
        this.initial();
        var status = this.status;
        if (e.target.innerText === "X") {
            this.firstX = true;
            status.turn = "Player1";
            document.getElementById('pl1').classList.add('turn');
        } else {
            this.firstX = false;
            status.turn = "Player2";
            document.getElementById('pl2').classList.add('turn');
        }
        (this.comp && !this.firstX) ?
            (document.getElementById('compthink').classList.remove('dispnone'),
            setTimeout(this.compAction, 1000)) : -1;
        this.setState({});
        document.getElementById('choicesign').classList.add('hidequestion');
        setTimeout(function(){
            document.getElementById('choicesign').classList.add('dispnone');
            document.getElementById('choicesign').classList.remove('hidequestion');
            document.getElementById('res').classList.remove('visibnone');
        }, 500);
    }
    makeChoice(e) {
        var variant = e.target.id,
            fields = this.fields;
        if (!fields[variant]) {
            fields[variant] = this.status.sign;
            this.history.push(variant);
            this.checkWinner();
        }
    }
    changeTurn() {
        this.status.sign = (this.status.sign === "X") ? "O" : "X";
        this.status.turn = (this.status.turn === "Player1") ? "Player2" : "Player1";
        if (this.status.turn === "Player1") {
            document.getElementById('pl2').classList.remove('turn');
            document.getElementById('pl1').classList.add('turn');
        } else {
            document.getElementById('pl2').classList.add('turn');
            document.getElementById('pl1').classList.remove('turn');
        }
    }
    compAction() {
        var fields = this.fields,
            status = this.status,
            history = this.history,
            majorcells = ["a1", "a3", "c1", "c3", "b2"],
            othercells = ["a2", "b1", "b3", "c2"],
            pos = "";
        if (history.length === 0) {
            pos = majorcells[Math.floor(Math.random()*5)];
        } else if (history.length !== 0 && !fields["b2"]) {
            pos = "b2";
        } else {
            var result = [];
            for (var comb of this.combinations) {
                var full = [], emp = [];
                for (var el of comb) {
                    (history.includes(el)) ? full.push(el) : emp.push(el);
                }
                if (full.length === 2 && fields[full[0]] === fields[full[1]]) {
                    result.push([full, emp]);
                }
            }
            if (!result.length) {
                var emMaj = majorcells.filter((a) => !fields[a]);
                var emOth = othercells.filter((a) => !fields[a]);
                if (this.firstX && history.length === 3) {
                    var h0 = history[0], h2 = history[2];
                    if (fields["b2"] !== "X" && majorcells.includes(h0) && majorcells.includes(h2)) {
                        pos = emOth[Math.floor(Math.random()*emOth.length)];
                    }   //exclude player's win (1/3)
                        else if (majorcells.includes(h0) && othercells.includes(h2) ||
                                othercells.includes(h0) && majorcells.includes(h2)) {
                        var temp = (othercells.includes(h0)) ? h0 : h2;
                        switch(temp) {
                            case "a2":
                                pos = "a1";
                            break;
                            case "b1":
                                pos = "c1";
                            break;
                            case "c2":
                                pos = "c3";
                            break;
                            case "b3":
                                pos = "a3";
                        }
                    } else {
                        pos = emMaj[Math.floor(Math.random()*emMaj.length)];
                    }

                } else {
                    pos = emMaj.length ? emMaj[Math.floor(Math.random()*emMaj.length)] :
                                         emOth[Math.floor(Math.random()*emOth.length)];
                }
            } else {
                for (var variant of result) {
                    (fields[variant[0][0]] === status.sign) ? pos = variant[1][0] : -1;
                }
                if (!pos) {
                    for (var variant of result) {
                        (fields[variant[0][0]] !== status.sign) ? pos = variant[1][0] : -1;
                    }
                }
            }
        }
        fields[pos] = status.sign;
        history.push(pos);
        document.getElementById('compthink').classList.add('dispnone');
        this.setState({}, this.checkWinner);
    }
    checkWinner() {
        var fields = this.fields,
            status = this.status;
        for (var comb of this.combinations) {
            if (fields[comb[0]] && fields[comb[0]] === fields[comb[1]] &&
                fields[comb[1]] === fields[comb[2]]) {
                for (let cell of comb) {
                    document.getElementById(cell).classList.add('winner');
                    setTimeout(function() {
                        document.getElementById(cell).classList.remove('winner');
                    }, 4500);
                }
                if (status.turn === "Player1") {
                    this.score.player1 += 1;
                    status.message = "Player 1 wins!";
                } else {
                    this.score.player2 += 1;
                    status.message = "Player 2 wins!";
                }
            }
        }
        if (this.history.length === 9 && status.message === "") {
            this.score.draw += 1;
            status.message = "Draw, Friends! :)";
        }
        !status.message ? this.changeTurn() : -1;
        if (status.message) {
            this.toggleMessage();
            document.getElementById('res').classList.add('visibnone');
            setTimeout(this.toggleMessage, 4500);
            setTimeout(this.clearBoard, 4500);
        } else if (this.comp === true && status.turn === "Player2") {
            document.getElementById('compthink').classList.remove('dispnone');
            setTimeout(this.compAction, 1000);
        }
        this.setState({});
    }
    toggleMessage() {
        var message = document.getElementById('winmess').classList;
        message.toggle('dispnone');
        message.toggle('inform');
        document.getElementById('pl1').classList.remove('turn');
        document.getElementById('pl2').classList.remove('turn');
    }
    clearBoard() {
        this.initial();
        this.status.turn = (this.firstX) ? "Player1" : "Player2";
        this.setState({}, function() {
            document.getElementById("pl" + this.status.turn[6]).classList.add('turn');
        });
        document.getElementById('res').classList.remove('visibnone');
        (this.comp && !this.firstX) ?
            (document.getElementById('compthink').classList.remove('dispnone'),
            setTimeout(this.compAction, 1000)) : -1;
    }
    resetGame() {
        this.initial();
        this.score = {"player1": 0, "player2": 0, "draw": 0};
        this.setState({});
        document.getElementById('choiceplayer').classList.remove('dispnone');
        document.getElementById('pl1').classList.remove('turn');
        document.getElementById('pl2').classList.remove ('turn');
        document.getElementById('res').classList.add('visibnone');
    }
    render() {
        var fields = this.fields;
        return (
            <div className="mainboard">
                <div className="scoreboard">
                    <div id="pl1" className="score_header">Player 1</div>
                    <div id="pl2" className="score_header">Player 2</div>
                    <div className="score_header">Draw :)</div>
                    <div className="score_body">{this.score.player1}</div>
                    <div className="score_body">{this.score.player2}</div>
                    <div className="score_body">{this.score.draw}</div>
                </div>
                <div className="fieldsboard">
                    <div id="choiceplayer">
                        <div className="textmess pltop">Choose your opponent:
                            <div className="pltop"><span className="pl" onClick={this.setupOppo}>Human</span>
                                <span className="pl" onClick={this.setupOppo}>Computer</span>
                            </div>
                        </div>
                    </div>
                    <div id="choicesign" className="dispnone">
                        <div className="textmess signtop">Player 1!<br/> Choose your sign:
                            <div><span className="signs" onClick={this.setupTurn}>X</span>
                                <span className="signs" onClick={this.setupTurn}>O</span>
                            </div>
                            <div className="backarrow" onClick={this.goBack}>⇦ back</div>
                        </div>
                    </div>
                    <div id="winmess" className="dispnone"><div className="textmess wintop">{this.status.message}</div></div>
                    <div id="compthink" className="dispnone"><div className="textmess wintop">Comp's turn</div></div>
                    <table>
                        <tbody>
                            <tr>
                                <td id="a1" onClick={this.makeChoice}>{fields["a1"]}</td>
                                <td id="a2" onClick={this.makeChoice}>{fields["a2"]}</td>
                                <td id="a3" onClick={this.makeChoice}>{fields["a3"]}</td>
                            </tr>
                            <tr>
                                <td id="b1" onClick={this.makeChoice}>{fields["b1"]}</td>
                                <td id="b2" onClick={this.makeChoice}>{fields["b2"]}</td>
                                <td id="b3" onClick={this.makeChoice}>{fields["b3"]}</td>
                            </tr>
                            <tr>
                                <td id="c1" onClick={this.makeChoice}>{fields["c1"]}</td>
                                <td id="c2" onClick={this.makeChoice}>{fields["c2"]}</td>
                                <td id="c3" onClick={this.makeChoice}>{fields["c3"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="res" className="butreset visibnone" onClick={this.resetGame}>Reset</div>
            </div>
        )
    }
}

module.exports = Game;
