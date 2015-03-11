

var pageIndex = ReactiveVar(1);

var inputValue1 = ReactiveVar(2);
var inputValue2 = ReactiveVar(-1);
var inputValue3 = ReactiveVar(3);
var guessedComputerRule = ReactiveVar(false);
var computerRuleSubmitted = ReactiveVar(false);
var progress = ReactiveVar(0);
var thinking = ReactiveVar(false);
var doneThinking = ReactiveVar(false);
var inputValues = [];
var outputValues = [];
var isThisRight = [.25,.25,.25,.25];
var currentLearningSet = ReactiveVar();
var learningFunctionValue = ReactiveVar(0);

var calculator;
var inputGuesses = [inputValue1,inputValue2,inputValue3]

x1 = [-8,-6,0,1,4,12];

var coefficients;

Template.currentPage.helpers({
is1: function(){
    
return (pageIndex.get()==1);    
    
},
is2: function(){
    
return (pageIndex.get()==2);    
    
},
is3: function(){
    
return (pageIndex.get()==3);    
    
},
is4: function(){
    
return (pageIndex.get()==4);    
    
},
is5: function(){
    
return (pageIndex.get()==5);    
    
},
is6: function(){
    
return (pageIndex.get()==6);    
    
},
is7: function(){
    
return (pageIndex.get()==7);    
    
},
is8: function(){
    
return (pageIndex.get()==8);    
    
}
      
    
});

Template.buttonBar.events({
   
'click #next':function(){
    
 var currentValue = pageIndex.get();
 if((currentValue !=8)){pageIndex.set(currentValue+1);}
 
    
},
'click #back':function(){
    
 var currentValue = pageIndex.get();
 if((currentValue !=1)){pageIndex.set(currentValue-1);}
 
    
}
    
});

Template.main.helpers({
    
calculator:function(){
    
 return '<div id="calculator" style="width: 300px; height: 300px;"></div>';   
    
}
    
});

Template.makeGuess.helpers({
    
   output: function(){
       
    var guess = this.get();
    return (coefficients[0]*guess+coefficients[1]);
       
       
   },
 currentVal: function(){
     
  return this.get();   
 }
    
});

Template.makeGuess.events({
    
 'change .inputNumber':function(e){
     
  this.set(parseInt($(e.target).val())); 
     
 }
    
});

Template.guessComputerRule.events({
    
   
    'click #submitGuessComputerRule':function(){
        
     computerRuleSubmitted.set(true);    
     var y1 = generateLinearValues(x1,[0,0,coefficients[0],coefficients[1]]);    
     var y1L=[];   
        
     var inputRule = $("#guessComputerRuleInput").val().replace(/number/gi,'m');
     var enteredExpression ="y_2="+ inputRule;   
     calculator.setExpression({id:"guessComputerRule",latex:enteredExpression});
     functionValue = calculator.HelperExpression({latex:"y_2"});
        
     var i = 0;    
     var mExpression = "m="+String(x1[i]);
     calculator.setExpression({id:"inputValue",latex:mExpression});
     var mValue = calculator.HelperExpression({latex:"m"});
     
     
     var a = setInterval(function(){
     if(i<x1.length){    
     mExpression = "m="+String(x1[i]);
     calculator.setExpression({id:"inputValue",latex:mExpression});
     i++;    
     }
     else{
         clearInterval(a);
         var guessedCorrectly = arraysEqual(y1L,y1);
         guessedComputerRule.set(guessedCorrectly);
         };
     },1);
        



        functionValue.observe('numericValue',function(a){
        //whenever functionValue changes, add the new value to the y1L array
            y1L.push(functionValue.numericValue); 

 
        });        
    }
       
});

Template.slide2.helpers({
    
   inputGuess:function(){
       
    return inputGuesses;   
       
   }
    
});

Template.slide3.helpers({
    
   guessedCorrectly:function(){
    
    return guessedComputerRule.get();
       
   },
    submittedGuess: function(){
        
      return computerRuleSubmitted.get();   
        
    }
    
});

Template.slide5.helpers({
    
   thinking: function(){
       
    return thinking.get();   
       
   },
   doneThinking: function(){
       
    return doneThinking.get();   
       
   }
    
    
});

Template.slide5.events({
    
   'click #submitInputData':function(){
    learningFunctionValue.set(0);   
    thinking.set(true);
    var xI1 = parseInt($("#input1").val());
    var yI1 = parseInt($("#output1").val());
    var xI2 = parseInt($("#input2").val());
    var yI2 = parseInt($("#output2").val());
    var xI3 = parseInt($("#input3").val());
    var yI3 = parseInt($("#output3").val());
    inputValues = inputValues.concat([xI1,xI2,xI3]);
    outputValues = outputValues.concat([yI1,yI2,yI3]);
    var xList = "x_1=\\left["+xI1+","+xI2+","+xI3+"\\right]";
    var yList = "y_1=\\left["+yI1+","+yI2+","+yI3+"\\right]";
    calculator.setExpression({id:"inputValues",latex:xList});
    calculator.setExpression({id:"outputValues",latex:yList}); 
    fakeProgress();   
   }
    
});

Template.slide6.helpers({
    
   guesses: function(){
        
        
        return currentLearningSet.get();
       
   },
    
    doneGuessing: function(){
     var curVal =learningFunctionValue.get()  
        
     return (curVal>=0.9);
        
    }
    
});

Template.slide6.rendered = function(){
    
 var learningSet = []
        for(var i = 0;i<4;i++){
        var values = buildGuessObject();
        var randomSelection = Math.round(Math.random()*3)
        learningSet.push(values[randomSelection]);
        }
        currentLearningSet.set(learningSet);   
 progress.set(0);   
    
}

Template.isThisRight.events({

    'change .yesOrNo':function(e){
        
     var curVal = parseInt($(e.target).val());
     if(curVal==1){
         
    inputValues = inputValues.concat([this.input]);
    outputValues = outputValues.concat([this.output]);
    a = calculator.getState();
    var listExp = a.expressions.list.length     
    var xList = a.expressions.list[listExp-2].latex.split('[')[1].split('\\r');
    var yList = a.expressions.list[listExp-1].latex.split('[')[1].split('\\r');
         
    var xList = "x_1=\\left["+ xList[0] +","+ this.input+"\\right]";
    var yList = "y_1=\\left["+ yList[0] + ","+ this.output+"\\right]";
    calculator.setExpression({id:"inputValues",latex:xList});
    calculator.setExpression({id:"outputValues",latex:yList});  
    isThisRight[this.id]*=2;
    
    
         
     }
     else{
         
     isThisRight[this.id]*=0.3;    
         
         
     }
    var currentTrainingSet = currentLearningSet.get();
    for(var i = 0;i<4;i++){
        
    if((currentTrainingSet[i].input==this.input) & (currentTrainingSet[i].output==this.output))  {
        
    currentTrainingSet[i] = getNewGuessObject();    
        
        
    }
        
    }
    
    currentLearningSet.set(currentTrainingSet.concat([]));
    $(e.target).val('Select one:')
    var a = evalLearningFunction(this.input)
    
    var maxVal = maxArray(isThisRight)
    learningFunctionValue.set(maxVal[0]);
    progress.set(100*maxVal)
    console.log(isThisRight);
    }
    
    
});


Template.progressBar.helpers({
    
   currentProgressValue:function(){
       
    return progress.get();   
       
   }
    
});

Template.yourRule.helpers({
    
   yourRule:function(){
       
    var maxData = maxArray(isThisRight);
    a = calculator.getState();
    var currentExp = a.expressions.list[maxData[1]+1];
    currentExp.latex = currentExp.latex.replace('~','=');
    return currentExp.latex;
    
       
   },
    properties: function(){
        
     var maxData = maxArray(isThisRight);
    a = calculator.getState();
    var currentExp = a.expressions.list[maxData[1]+1].regressionParameters;
    var parameters = [];
    for (var property in currentExp) {
    if (currentExp.hasOwnProperty(property)) {
        var currentPropertyValue = parseFloat(currentExp[property]);
        if(Math.abs(currentPropertyValue)<1E-5){
            
            currentExp[property]=0;
        }
        parameters.push({variable:property,value:currentExp[property]})
    }
}    
    return parameters;    
    }
    
});

Template.yourRule.rendered = function(){
    
 $('#yourRule').mathquill(); 
    
    
};

Template.main.rendered = function(){
    
 var elt = document.getElementById('calculator');
 var showExpressions = true;
 calculator = Desmos.Calculator(elt,{expressions:showExpressions});
 
 coefficients = makeRandomLinear();
 var equation = 'y='+String(coefficients[0])+'x+'+String(coefficients[1]);    
  calculator.setExpression({id:'graph1', latex:equation});
  
calculator.setExpression({id:"linearRegression",latex:"y_1~c(x_1)+d"});
calculator.setExpression({id:"quadraticRegression",latex:"y_1~b(x_1)^2+c(x_1)+d"});
calculator.setExpression({id:"cubicRegression",latex:"y_1~a(x_1)^3+b(x_1)^2+c(x_1)+d"});
calculator.setExpression({id:"exponentialRegression",latex:"y_1~b*c^{x_1}+d"});    
calculator.setExpression({id:"guessData",latex:"\\left(x_1,y_1\\right)"});
}

var makeRandomLinear = function(){
    
 var a = Math.round(Math.random()*10)-5;
 var b = Math.round(Math.random()*6)-3;
 
return [a,b];    
    
}

var getValue = function(x,coefficients){
    
return (coefficients[0]*x + coefficients[1]);    
    
}

var generateLinearValues = function(xValues,coef){
var yValues = []    
xValues.forEach(function(x){
    
var y = coef[0]*x*x*x + coef[1]*x*x+coef[2]*x+coef[3];
yValues.push(Math.round(y));
    
});

return yValues;
    
}

var generateLatexList = function(array,vbl){
    
var exp = vbl + "_1=\\left[";    
array.forEach(function(x){

exp = exp + String(x)+',';    
    
});
exp = exp.slice(0,exp.length-1);
exp += "\\right]";
return exp;
    
}

var getRegressionParameters = function(expressionId){
    
 var a = calculator.getState();
 var expressionArray = a.expressions.list;
 
 var output;
 expressionArray.forEach(function(exp){
 
 if(exp.id==expressionId){
     
     output = exp.regressionParameters;
     return output;
 }
 
    
 });
 return output;   
    
}

var arraysEqual = function(a,b){
    
for(var i = 0;i<a.length;i++){
    
    if(a[i]!=b[i]){
        
        return false;
    
       }
    
    
}
return true;
}

var evalCubicRegression=function(x){

    params = getRegressionParameters("cubicRegression");  
return params.a*Math.pow(x,3)+params.b*Math.pow(x,2)+params.c*Math.pow(x,3)+params.d*Math.pow(x,4);    
    
    
}

var evalLinRegression=function(x){
params = getRegressionParameters("linearRegression");    
return params.c*x+params.d;    
    
    
}

var evalQuadRegression=function(x){
params = getRegressionParameters("quadraticRegression");      
return params.b*x*x+params.c*x+params.d;    
 
    
}

var evalExpRegression = function(x){
params = getRegressionParameters("exponentialRegression");    
return params.b*Math.pow(params.c,x)+params.d;    
    
}

var evaluateRegressions = function(x){
    
return [evalLinRegression(x),evalQuadRegression(x), evalCubicRegression(x), evalExpRegression(x)];     
    
    
}

var fakeProgress = function(){
    
 a = setInterval(function(){
      
      var curVal = progress.get();
      curVal += 5*Math.random();
      if(curVal<=100){
      progress.set(curVal);
      }
      else{
          progress.set(100);
          clearInterval(a);
          doneThinking.set(true);
      }
  },30)   
    
}

var buildGuessObject = function(){
 
 var guesses = [];
    
    
 for(var i = 0;i<4;i++){
 var valueNotSelected = true;
 while(valueNotSelected){
            var guessValue = Math.round(Math.random()*16) - 4;
            valueNotSelected = (inputValues.indexOf(guessValue)!=-1);
 } 
 var value = evaluateRegressions(guessValue);     
 guesses.push({input:guessValue,output:Math.round(value[i]),id:i});     
 }

 return guesses;
    
    
}

var getNewGuessObject = function(){
    

        var values = buildGuessObject();
        var randomSelection = pickWeightedProbability(isThisRight);
        return values[randomSelection];
        
    
    
}

var evalLearningFunction= function(x){
    
var values = evaluateRegressions(x);
var sum = 0;
isThisRight.forEach(function(x){
sum+=x    
});
for(var i = 0;i<4;i++){
isThisRight[i]=isThisRight[i]/sum;    
    
}

var output = isThisRight[0]*values[0]+isThisRight[1]*values[1]+isThisRight[2]*values[2]+isThisRight[3]*values[3];
return output;
    
}

var pickWeightedProbability = function(isThisRight){
    
 var randomNumber = Math.random();
 var sum = 0;
 
for(var i = 0;i<3;i++){
 
  
 if((randomNumber>sum) & (randomNumber<= (sum+isThisRight[i]))){
  
  return i;   
 }
 sum+=isThisRight[i];    
    
}
 return isThisRight.length-1;
    
}

var maxArray = function(array){
    
var maxIndex = 0;
var maxValue = 0;
for(var i = 0;i<array.length;i++){
    
 if(array[i]>maxValue){
  maxValue = array[i];
  maxIndex = i;
     
 }

 
}
return [maxValue,maxIndex];    
    
}