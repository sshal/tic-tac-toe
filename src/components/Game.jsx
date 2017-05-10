var React = require('react');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.infi= {
            "fields": {
                "a1": null,
                "a2": null,
                "a3": null,
                "b1": null,
                "b2": null,
                "b3": null,
                "c1": null,
                "c2": null,
                "c3": null
            }
        };
        this.inst = {
            "status": {
                "sign": "X",
                "turn": "Player1",
                "count": 0,
                "winner": "",
                "wincombo": "",
                "message": ""
            }
        };
        this.insc = {
            "score": {
                "player1": 0,
                "player2": 0,
                "draw": 0
            }
        };
        this.state = Object.assign({}, this.infi, this.inst, this.insc);
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
        this.makeChoice = this.makeChoice.bind(this);
        this.clearBoard = this.clearBoard.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.toggleMessage = this.toggleMessage.bind(this);
        this.changeTurn = this.changeTurn.bind(this);
        this.setupTurn = this.setupTurn.bind(this);
        this.setupOppo = this.setupOppo.bind(this);
        this.goBack = this.goBack.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }
    setupOppo(e) {
        var state = Object.assign({}, this.state);
        if (e.target.innerText === "Computer") {
            state.comp = true;
        } else {
            state.comp = false;
        }
        this.setState(state);
        document.getElementById('choiceplayer').classList.add('dispnone');
        document.getElementById('choicesign').classList.remove('dispnone');
    }
    goBack() {
        document.getElementById('choicesign').classList.add('dispnone');
        document.getElementById('choiceplayer').classList.remove('dispnone');
    }
    setupTurn(e) {
        var status = Object.assign({}, this.state.status);
        if (e.target.innerText === "X") {
            status.turn = "Player1";
            this.setState({"firstX": true});
            document.getElementById('pl1').classList.add('turn');
        } else {
            status.turn = "Player2";
            this.setState({"firstX": false});
            document.getElementById('pl2').classList.add('turn');
        }
        this.setState({"status": status});
        document.getElementById('choicesign').classList.add('hidequestion');
        setTimeout(function(){
            document.getElementById('choicesign').classList.add('dispnone');
            document.getElementById('choicesign').classList.remove('hidequestion');
            document.getElementById('res').classList.remove('visibnone');
        }, 500);
    }
    makeChoice(e) {
        var temp = e.target.id,
            fields = Object.assign({}, this.state.fields),
            status = Object.assign({}, this.state.status);
        if (fields[temp] === null) {
            fields[temp] = status.sign;
            status.count += 1;
            this.setState({fields: fields, status: status}, this.checkWinner);
        }
    }
    changeTurn(st) {
        if (st === "Player1") {
            document.getElementById('pl2').classList.remove('turn');
            document.getElementById('pl1').classList.add('turn');
        } else {
            document.getElementById('pl2').classList.add('turn');
            document.getElementById('pl1').classList.remove('turn');
        }
    }
    checkWinner() {
        var fields = Object.assign({}, this.state.fields),
            score = Object.assign({}, this.state.score),
            status = Object.assign({}, this.state.status);
        for (var comb of this.combinations) {
            if (fields[comb[0]] && fields[comb[0]] === fields[comb[1]] && fields[comb[1]] === fields[comb[2]]) {
                status.wincombo = comb;
                for (let cell of status.wincombo) {
                    document.getElementById(cell).classList.add('winner');
                }
                if (status.turn === "Player1") {
                    status.winner = "Player1";
                    score.player1 += 1;
                    status.message = "Player 1 wins!";
                } else {
                    status.winner = "Player2";
                    score.player2 += 1;
                    status.message = "Player 2 wins!";
                }
            }
        }
        if (status.count === 9 && status.winner === "") {
            status.winner = "Draw";
            score.draw += 1;
            status.message = "Draw, Friends! :)";
        }
        if (!status.winner) {
            status.sign = (status.sign === "X") ? "O" : "X";
            status.turn = (status.turn === "Player1") ? "Player2" : "Player1";
            this.changeTurn(status.turn);
        }
        this.setState({fields: fields, score: score, status: status}, function(){
            if (this.state.status.winner) {
                this.toggleMessage();
                document.getElementById('res').classList.add('visibnone');
                setTimeout(this.toggleMessage, 4500);
                setTimeout(this.clearBoard, 4500);
            }
        });
    }
    toggleMessage() {
        var message = document.getElementById('winmess').classList;
        message.toggle('dispnone');
        message.toggle('inform');
        document.getElementById('pl1').classList.remove('turn');
        document.getElementById('pl2').classList.remove('turn');
    }
    clearBoard() {
        var copyCombo = this.state.status.wincombo.slice(0,);
        for (let cell of copyCombo) {
            document.getElementById(cell).classList.remove('winner');
        }
        var state = Object.assign({}, this.infi, this.inst);
        state.status.turn = (this.state.firstX) ? "Player1" : "Player2";
        this.setState(state, this.changeTurn(state.status.turn));
        document.getElementById('res').classList.remove('visibnone');
    }
    resetGame() {
        this.setState(Object.assign({}, this.infi, this.inst, this.insc));
        document.getElementById('choiceplayer').classList.remove('dispnone');
        document.getElementById('pl1').classList.remove('turn');
        document.getElementById('pl2').classList.remove ('turn');
        document.getElementById('res').classList.add('visibnone');
    }
    render() {
        var state = this.state;
        var fields = state.fields;
        return (
            <div className="mainboard">
                <div className="scoreboard">
                    <div id="pl1" className="score_header">Player 1</div>
                    <div id="pl2" className="score_header">Player 2</div>
                    <div className="score_header">Draw :)</div>
                    <div className="score_body">{state.score.player1}</div>
                    <div className="score_body">{state.score.player2}</div>
                    <div className="score_body">{state.score.draw}</div>
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
                    <div id="winmess" className="dispnone"><div className="textmess wintop">{state.status.message}</div></div>
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
