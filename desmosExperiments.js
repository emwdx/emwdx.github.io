//experiment notes



x = ["1","2","3","4","5","6"]
y = ["5","4","3","2","1","0"]
newArray = [x,y]
Calc._calc.expressionsView.addExpressionView.newTable(newArray)
Calc.setExpression({id:"regression",latex:"y_1~ax_1^2+bx_1+c"})

var makeRandomLinear = function(){
    
 var a = Math.round(Math.random()*10)-5;
 var b = Math.round(Math.random()*6)-3;
 
return [a,b];    
    
}

