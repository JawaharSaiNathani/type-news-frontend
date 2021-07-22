import React, { useEffect, useState } from 'react';
import loading_logo from './loading.gif';
import './App.css';

function App() {

	const [news, setNews] = useState(null);
	const [articleCount, setArticleCount] = useState(0);
	const [paraCount, setParaCount] = useState(0);
	const [headline, setHeadline] = useState(null);
	const [content, setContent] = useState(null);
	const [indexEnd, setIndexEnd] = useState(0);
	const [inputLength, setInputLength] = useState(0);
	const [curIndex, setCurIndex] = useState(0);
	const [isMistake, setIsMistake] = useState(false);
	const [disableInputField, setdisableInputField] = useState(false);
	const [timeLeft, setTimeLeft] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [curSpeed, setCurSpeed] = useState(0);
	const [avgSpeed, setAvgSpeed] = useState(0);
	const [skillLevel, setSkillLevel] = useState("Average");
	const [totalParas, setTotalParas] = useState(0);
	const [mistakes, setMistakes] = useState(['mistake1', 'mistake2']);
	const textInput = React.createRef();

	const clearText = () => {
		document.getElementById("displayText_subcontainer").innerHTML = "";
		document.getElementById("input_field").value = "";
		setIndexEnd(0);
		setInputLength(0);
		setCurIndex(0);
		setIsMistake(false);
		setMistakes([]);
		setdisableInputField(true);
	}

	const addText = () => {
		var textContainer = document.getElementById("displayText_subcontainer");
		for (let i = 0; i < news[articleCount]['paras'][paraCount].length; i++) {
			textContainer.innerHTML += `<span id="${i}" style="color: #FFF; padding-right: 1px;">${news[articleCount]['paras'][paraCount].charAt(i)}</span>`;
		}
	}

	const onNext = () => {
		setHeadline(news[articleCount]['heading']);
		setContent(news[articleCount]['paras'][paraCount]);
		clearText();
		addText();
		if (paraCount === news[articleCount]['paras'].length - 1) {
			setParaCount(0);
			if (articleCount === news.length - 1) {
				setArticleCount(0);
			} else {
				setArticleCount(articleCount + 1);
			}
		}
		else {
			setParaCount(paraCount + 1);
		}
		setTimeLeft(5);
	}

	const activateInputField = () => {
		textInput.current.focus();
	}

	const getNewsArticles = async () => {
		const api_call = await fetch(`https://type-news-backend.herokuapp.com/`);
		const data = await api_call.json();
		setNews(data['news'][0]);
	}

	useEffect(() => {
		getNewsArticles();
	}, []);

	useEffect(() => {
		if (news != null) {
			onNext();
		} // eslint-disable-next-line
	}, [news]);

	useEffect(() => {
		if (news != null) {
			if (timeLeft === 1) {
				setdisableInputField(false);
			}
			if (timeLeft === 0) {
				setdisableInputField(false);
				setStartTime(new Date().toLocaleString());
				setTimeLeft(null);
				activateInputField();
			}
			if (!timeLeft) return;
			const intervalId = setInterval(() => {

				setTimeLeft(timeLeft - 1);
			}, 1000);
			return () => clearInterval(intervalId);
		} // eslint-disable-next-line
	}, [timeLeft, news]);

	const updateText = (e) => {
		e.preventDefault();
		var input_field = document.getElementById("input_field");
		var input_val = input_field.value;
		if (input_val.length > inputLength) {
			setInputLength(input_val.length);
			if (isMistake === false && content.charAt(indexEnd) === input_val.charAt(input_val.length - 1)) {
				document.getElementById(indexEnd).style.color = "#1DB954";
				setCurIndex(curIndex + 1);
				if (content.charAt(indexEnd) === " ") {
					setIndexEnd(indexEnd + 1);
					setInputLength(0);
					input_field.value = "";
					var st_hrs,st_min,st_sec,cur_hrs,cur_min, cur_sec;
					var curTime = new Date().toLocaleString();
					var temp = 0;
					var flag = 0;
					for(let i=0;i<curTime.length;i++)
					{
						if(curTime.charAt(i) === ',')
						{
							temp = i+1;
						}
						if(curTime.charAt(i) === ':')
						{
							if(flag === 0)
							{
								cur_hrs = curTime.substring(temp, i);
							}
							else if(flag === 1)
							{
								cur_min = curTime.substring(temp, i);
								cur_sec = curTime.substring(i+1, i+3);
							}
							flag += 1;
							temp = i+1;
						}
					}
					temp = 0;
					flag = 0;
					for(let i=0;i<startTime.length;i++)
					{
						if(startTime.charAt(i) === ',')
						{
							temp = i+1;
						}
						if(startTime.charAt(i) === ':')
						{
							if(flag === 0)
							{
								st_hrs = startTime.substring(temp, i);
							}
							else if(flag === 1)
							{
								st_min = startTime.substring(temp, i);
								st_sec = startTime.substring(i+1, i+3);
							}
							flag += 1;
							temp = i+1;
						}
					}
					var time_diff = ((cur_hrs - st_hrs) * 60 * 60) + ((cur_min - st_min) * 60) + (cur_sec - st_sec);
					setCurSpeed(Math.round((((curIndex / 5) / time_diff) * 60)));
				} else {
					setIndexEnd(indexEnd + 1);
				}
				if (curIndex + 1 === content.length) {
					setdisableInputField(true);
					input_field.value = "";
					curTime = new Date().toLocaleString();
					temp = 0;
					flag = 0;
					for(let i=0;i<curTime.length;i++)
					{
						if(curTime.charAt(i) === ',')
						{
							temp = i+1;
						}
						if(curTime.charAt(i) === ':')
						{
							if(flag === 0)
							{
								cur_hrs = curTime.substring(temp, i);
							}
							else if(flag === 1)
							{
								cur_min = curTime.substring(temp, i);
								cur_sec = curTime.substring(i+1, i+3);
							}
							flag += 1;
							temp = i+1;
						}
					}
					temp = 0;
					flag = 0;
					for(let i=0;i<startTime.length;i++)
					{
						if(startTime.charAt(i) === ',')
						{
							temp = i+1;
						}
						if(startTime.charAt(i) === ':')
						{
							if(flag === 0)
							{
								st_hrs = startTime.substring(temp, i);
							}
							else if(flag === 1)
							{
								st_min = startTime.substring(temp, i);
								st_sec = startTime.substring(i+1, i+3);
							}
							flag += 1;
							temp = i+1;
						}
					}
					time_diff = ((cur_hrs - st_hrs) * 60 * 60) + ((cur_min - st_min) * 60) + (cur_sec - st_sec);
					setCurSpeed(Math.round((((curIndex / 5) / time_diff) * 60)));
					var avg_speed = Math.round((((avgSpeed * totalParas) + Math.round((((curIndex / 5) / time_diff) * 60))) / (totalParas + 1)));
					setAvgSpeed(avg_speed);
					if (avg_speed < 25) {
						setSkillLevel("Beginner");
					} else if (avg_speed < 31) {
						setSkillLevel("Intermediate");
					} else if (avg_speed < 42) {
						setSkillLevel("Average");
					} else if (avg_speed < 55) {
						setSkillLevel("Pro");
					} else if (avg_speed < 80) {
						setSkillLevel("Type Master");
					} else if (avg_speed >= 80) {
						setSkillLevel("Grand Type Master");
					}
					setTotalParas(totalParas + 1);
				}
			} else {
				document.getElementById(indexEnd).style.backgroundColor = "red";
				if(isMistake === false)
				{
					var wordStart = 0;
					var wordEnd = content.length;
					var i = indexEnd - 1;
					while(i>0)
					{
						if(content.charAt(i) === ' ')
						{
							wordStart = i+1;
							break;
						}
						i--;
					}
					i = indexEnd;
					while(i<content.length)
					{
						if(content.charAt(i) === ' ')
						{
							wordEnd = i;
							break;
						}
						i++;
					}
					flag = 1;
					for(let i=0;i<mistakes.length;i++)
					{
						if(mistakes[i] === content.substring(wordStart,wordEnd+1))
						{
							flag = 0;
							break;
						}
					}
					if(flag === 1)
					{
						setMistakes([...mistakes,content.substring(wordStart,wordEnd+1)]);
					}
				}
				setIsMistake(true);
				setIndexEnd(indexEnd + 1);
			}
		} else if (input_val.length < inputLength) {
			document.getElementById(indexEnd - 1).style.color = "#FFF";
			document.getElementById(indexEnd - 1).style.backgroundColor = "";
			if (indexEnd > 1 && document.getElementById(indexEnd - 2).style.backgroundColor === "") {
				setIsMistake(false);
			} else if (indexEnd === 1) {
				setIsMistake(false);
			}
			setInputLength(input_val.length);
			setIndexEnd(indexEnd - 1);
		}
	}

	const timer = () => {
		if (timeLeft != null) {
			return (
				<div>
					<h3 className="timer">You can start Typing in : {timeLeft}</h3>
				</div>
			)
		}
	}

	const renderTemplate = () => {
		if (news == null) {
			return (
				<div className="startMsgContainer">
					<img src={loading_logo} alt="" className="loadingLogo" />
				</div>
			)
		}
		else {
			return (
				<div>
					<div className="header">
						<div className="titleContainer">
							<h1 className="title">News Typer</h1>
							<strong className="subtitle">Know the world while learning how to TYPE!!!</strong>
						</div>
					</div>

					<div className="content">
						<div className="maincontent">
							<div className="score_container">
								<div className="score_subcontainer">
									<div className="score_heading">
										Skill Level
                    		</div>
									<div className="score_value">
										{skillLevel}
									</div>
								</div>
								<div className="score_subcontainer center_score">
									<div className="score_heading">
										Current Speed
                    		</div>
									<div className="score_value">
										{curSpeed} wpm
                    		</div>
								</div>
								<div className="score_subcontainer">
									<div className="score_heading">
										Avg. Speed
                    		</div>
									<div className="score_value">
										{avgSpeed} wpm
                    		</div>
								</div>
							</div>
							<div className="headlineContainer">
								<h3 className="headline">{headline}</h3>
							</div>
							<div className="displayText_maincontainer">
								{timer()}
								<div id="displayText_subcontainer" className="displayText_subcontainer">
								</div>
							</div>
							<div className="inputField_container">
								<input ref={textInput} id="input_field" type="text" placeholder="Type here" className="input_field" onChange={updateText} onPaste={(e) => { e.preventDefault(); }} disabled={(disableInputField) ? "disabled" : ""} />
							</div>
							<div className="button_container">
								<div className="button" onClick={onNext}>
									NEXT
                		</div>
							</div>
						</div>
						<div className="sidebar">
							<div className="mistakesHeading">
								Mistakes
							</div>
							<div className="wordsContainer">
								{mistakes.map((mistake) => {
										return <div key={mistake} className="mistakeContainer"><div className="mistake">{mistake}</div></div>;
									})}
							</div>
						</div>
					</div>
				</div>
			)
		}
	}

	return (
		<div>
			{renderTemplate()}
		</div>
	);
}

export default App;
