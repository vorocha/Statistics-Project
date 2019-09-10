/*/##############################################   ANGULAR
var app = angular.module('spFatec', []);

app.controller('MainCtrl', function($scope) {

});
*/
//##############################################   MANUAL
let input1 = [2000, 3000, 4000, 4000, 3000, 2000, 5000, 2000, 3000, 3000, 3000, 2000, 4000, 4000, 3000, 5000, 4000, 3000, 4000, 3000];
let input2 = ['EF', 'EF', 'EF', 'EF', 'EM', 'EM', 'EM', 'EM', 'ES', 'PG', 'PG', 'ES', 'ES', 'ES', 'PG', 'PG', 'ES', 'ES', 'ES', 'ES', 'EM', 'EM', 'EM', 'EM', 'EM', 'EF', 'EF', 'PG', 'PG', 'ES'];
let input3 = [37, 34, 20, 43, 37, 55, 27, 37, 23, 46, 56, 43, 60, 32, 27, 60, 53, 51, 45, 45, 28, 41, 38, 38, 56, 65, 63, 23, 56, 34, 27, 34, 38, 30, 29, 47, 47, 45, 42, 55, 50, 35];
let input4 = ['Preta', 'Rosa', 'Rosa', 'Branca', 'Rosa', 'Azul', 'Amarela', 'Preta', 'Branca', 'Rosa', 'Preta', 'Amarela', 'Rosa', 'Branca', 'Branca', 'Azul', 'Rosa', 'Amarela', 'Rosa', 'Branca', 'Branca', 'Azul', 'Branca', 'Branca', 'Branca', 'Branca', 'Azul', 'Branca', 'Rosa', 'Preta'];
let input5 = [6,7,9,10,12,14,15,15,15,16,16,17,18,18,18,18,19,19,20,20,20,20,21,21,21,22,22,23,24,25,25,26,26,28,28,30,32,32,35,39];

function doDescriptive(inputs, varName){ //Chamada inicial para processo da estatistica descritiva
	//faz chamada para tabela simples
	let tableObj = getSimple(inputs);
	//descobre o tipo de variavel
	let descriptiveClass = getClass(inputs, tableObj.length);
	
	//continua com a tabela simples ou vai para a de intervalos
	if(descriptiveClass != "INTERVAL-NUMBER"){
		tableObj = getSimple(inputs);
	} else {
		tableObj = getSimple(inputs);
		tableObj = getInterval(tableObj, inputs);
	}

	//adiciona as frequencias
	addFreqs(tableObj, inputs);

	//retona obj com calculos de tendencia central
	let centralTendency = calcCentralTendency(tableObj, descriptiveClass, inputs);
	drawCentralTendencyTable(centralTendency);

	//adiciona a tabela e o grafico de acordo com o tipo de variavel
	if(descriptiveClass != "INTERVAL-NUMBER"){
		if(descriptiveClass == "SIMPLE-TEXT"){
			//tabela simples texto
			drawSimpleTextTable(tableObj, varName);	

			//grafico pizza
			drawPieChart(tableObj, varName);
		} else if(descriptiveClass == "SIMPLE-NUMBER"){
			//tabela simples numero
			drawSimpleNumberTable(tableObj, varName);

			//grafico de colunas
			drawColumnChart(tableObj, varName);
		}
	} else {
		//tabela de intervalos
		drawIntervalTable(tableObj, varName);
		
		//grafico histograma
		drawIntervalChart(inputs, tableObj, varName);
	}
	
}

function getClass(inputs, varQtd) { //Função para retornar o tipo da variavél a ser trabalhada
	inputs.sort();
	let aux = [];
	let varClass;
	
	for(let i = 0; i < inputs.length; i++){
		aux[i] = isNaN(inputs[i]) ? 0 : 1;
	}
	
	if(aux.indexOf(0) == 0 || aux.indexOf(1) == -1){
		varClass = "SIMPLE-TEXT";
	} else if(aux.indexOf(0) == -1 || aux.indexOf(1) == 0){
		for(let i = 0; i < inputs.length; i++){
			inputs[i] = parseFloat(inputs[i]);
		}
		if(varQtd > 6){
			varClass = "INTERVAL-NUMBER";
		} else {
			varClass = "SIMPLE-NUMBER";
		}
	} else {
		varClass = "ERROR";
	}
	return varClass;
}

function getSimple(inputs){ //cria uma tabela simples(nome da variavel e frequencia simples)
	inputs.sort();
	let vetQtd = [];
	let findFlag = false, findPos = -1;
	
	for(let i = 0; i < inputs.length; i++){
		for(let j = 0; j < vetQtd.length; j++){
			if(inputs[i] == vetQtd[j].name){
				findFlag = true;
				findPos = j;
			}
		}
		if(findFlag){			
			vetQtd[findPos].qtd += 1;
			findFlag = false;
		} else {
			let obj = {};
			obj.name = inputs[i];
			obj.qtd = 1;
			vetQtd.push(obj);
		}		
	}
	return vetQtd;
}

function getInterval(vetQtd, inputs){ //cria uma tabela com intervalos (minimo, maximo e frequencia simples)
	//calculos para definir linhas e intervalos
	let minAll = vetQtd[0].name;
	let maxAll = vetQtd[vetQtd.length-1].name
	let At = maxAll - minAll;	
	let K = Math.floor(Math.sqrt(inputs.length));
	let vetK = [K-1, K, K+1];
	
	for(let i = At+1; i != 0; i++){
		if(i%vetK[0] == 0){
			At = i;
			K = vetK[0];
			break;
		} else if(i%vetK[1] == 0){
			At = i;
			K = vetK[1];
			break;
		} else if(i%vetK[2] == 0){
			At = i;
			K = vetK[2];
			break;
		}
	}
	let Ic = At/K;	

	//calculo da frequencia
	let vetIntervals = [];
	let minIntervals = minAll;
	let maxIntervals = minAll + Ic;
	for(let i = 0; i < K; i++){		
		let obj = {min: minIntervals, max: maxIntervals, qtd: 0};
		for(let j = 0; j < vetQtd.length; j++){
			if(vetQtd[j].name >= obj.min && vetQtd[j].name < obj.max){
				obj.qtd += vetQtd[j].qtd;
			}			
		}
		vetIntervals.push(obj);
		minIntervals = maxIntervals;
		maxIntervals = minIntervals + Ic;
	}
	return vetIntervals;
}

function addFreqs(tableObj, inputs){ //adciona as frequencias para uma tabela ja criada, simples ou de intervalos
	let totalQtd = inputs.length;	
	let prevfRp = 0;
	let prevFac = 0;
	let prevFacp = 0;
	let round = 0;

	for(let obj of tableObj){
		//percentual individual
		obj.fRp = Math.round(((obj.qtd*100)/totalQtd)* 10) / 10;

		//frequencia acumulada
		obj.Fac = prevFac + obj.qtd;
		prevFac = obj.Fac;

		//frequencia acumulada percentual
		round = Math.round((((prevFacp + obj.fRp)))* 10) / 10;
		obj.Facp = round;
		prevFacp = obj.Facp;
	}	
}

function calcCentralTendency(tableObj, descriptiveClass, inputs){//faz os calculos de tendencia central
	let obj = {
		media: null,
		moda: null,
		mediana: null
	}

	obj.media = calcMedia(tableObj, descriptiveClass, inputs.length);
	obj.moda = calcModa(tableObj, descriptiveClass);
	obj.mediana = calcMediana(tableObj, descriptiveClass, inputs.length);

	return obj;
}

function calcMedia(tableObj, descriptiveClass, numElements){

	let sum = 0;
	let midPoint = 0;

	if(descriptiveClass == "SIMPLE-TEXT"){
		return "Não existe Média";
	} else if(descriptiveClass == "SIMPLE-NUMBER"){		
		for(let obj of tableObj){
			sum += obj.name * obj.qtd;
		}		
	} else if(descriptiveClass == "INTERVAL-NUMBER"){
		for(let obj of tableObj){
			midPoint = (obj.min + obj.max)/2;
			sum += midPoint * obj.qtd;
		}
	}
	return sum/numElements;
}

function calcModa(tableObj, descriptiveClass){
	let moda = [];
	let maxRep = 0;
	let aux = 0;

	for(let obj of tableObj){
		aux = obj.qtd;
		if(aux > maxRep){
			maxRep = aux;
		}
	}
	for(let obj of tableObj){
		if(obj.qtd == maxRep){
			if(descriptiveClass == "INTERVAL-NUMBER"){
				moda.push((obj.min + obj.max)/2);
			} else {
				moda.push(obj.name);
			}
		}
	}
	if(moda.length == tableObj.length){
		return "Não existe Moda";
	} else {
		return moda;
	}	
}

function calcMediana(tableObj, descriptiveClass, numElements){
	let mediana = [];
	let medianaPos = [];
	let medianaVal = [];
	let prevFac = 0;

	if(numElements % 2 == 0){
		medianaPos.push(numElements/2);
		medianaPos.push((numElements/2)+1);
	}else {
		medianaPos.push((numElements + 1) / 2);
	}

	if(descriptiveClass == "SIMPLE-TEXT" || descriptiveClass == "SIMPLE-NUMBER"){
		for(let pos of medianaPos){
			for(let obj of tableObj){
				if(pos <= obj.Fac){
					medianaVal.push(obj.name);
					break;
				}
			}
		}
		if(descriptiveClass == "SIMPLE-NUMBER"){
			mediana.push((medianaVal[0] + medianaVal[1])/2);
		} else {
			mediana = medianaVal;
		}
	}else if(descriptiveClass == "INTERVAL-NUMBER"){
		for(let obj of tableObj){
			if(medianaPos[0] <= obj.Fac){
				let calcMd = obj.min + (((medianaPos[0] - prevFac) / obj.qtd ) * (obj.max - obj.min));
				mediana.push(calcMd);
				break;
			}
			prevFac = obj.Fac;
		}
	}
	return mediana;
}

//##############################################   UPLOAD
function handleFiles(files) {
	// Arquivo suportado?
	if (window.FileReader) {
		getAsText(files[0]);
	} else {
		alert('Leitura de Arquivo não disponível');
	}
}

function getAsText(fileToRead) {
	let reader = new FileReader();
	reader.onload = loadHandler;
	// Retorna possiveis erros
	reader.onerror = errorHandler;
	// Traz o arquivo para leitura  
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	let csv = event.target.result;
	processData(csv);             
}

function processData(csv) {
	let allTextLines = csv.split(/\r\n|\n/);
	let lines = [];
	while (allTextLines.length) {
		lines.push(allTextLines.shift().split(','));
	}
	document.write(lines);
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}
