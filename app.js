//modules pattrens///////
var uiController = (function(){

  var domStrings = {
    type: ".add__type",
    discrip: ".add__description",
    valueStr: ".add__value",
    button: ".add__btn .ion-ios-checkmark-outline",
    incomeList: ".income__list",
    expenceList: ".expenses__list",
    container: ".container",
    itemspercantage: ".item__percentage",
    dateElement: ".budget__title--month"
  };

  var formetNumbers = function(num, type){

    num = Math.abs(num);
    num = num.toFixed(2);
    var split = num.split(".");
    var int = split[0];
    var dec = split[1];
    if(int.length>3){
      int = int.substr(0, int.length-3) + "," + int.substr(int.length-3, 3);
    }

    return (type === "exp" ? "-" : "+") + int + "." + dec;
  };

  return {
    getInput: function(){
      return {
        type: document.querySelector(domStrings.type).value,
        description: document.querySelector(domStrings.discrip).value,
        myValue: parseFloat(document.querySelector(domStrings.valueStr).value)
      };
    },

    addIteminList: function(newItemforList, typ){
      var html, newhtml, element;

      if(typ === "inc"){
        element = domStrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%dis%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      else if(typ === "exp"){
        element = domStrings.expenceList;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%dis%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      newhtml = html.replace("%id%", newItemforList.id);
      newhtml = newhtml.replace("%dis%", newItemforList.dis);
      newhtml = newhtml.replace("%val%", formetNumbers(newItemforList.val, typ));

      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);


    },

    deleteItemFromList: function(htmlElementId){
      var el = document.getElementById(htmlElementId);
      el.parentNode.removeChild(el);
    },

    clearInputField: function(){
      var fields, fieldArr, placeHold;
      fields = document.querySelectorAll(domStrings.discrip + ", " + domStrings.valueStr);
      fieldArr = Array.prototype.slice.call(fields);

      fieldArr.forEach(function(current, indexof, array){
        current.value = "";
      });

      fields[0].focus();
    },

    displayBudgetUI: function(obj){
      var typ;
      obj.budget>0 ? typ="inc" : typ="exp";
      document.querySelector(".budget__value").textContent = formetNumbers(obj.budget, typ);
      document.querySelector(".budget__income--value").textContent = formetNumbers(obj.totalIncome, "inc");
      document.querySelector(".budget__expenses--value").textContent = formetNumbers(obj.totalExpence, "exp");
      if(obj.percentage>0)
      {
        document.querySelector(".budget__expenses--percentage").textContent = obj.percentage + "%";
      }
      else{
        document.querySelector(".budget__expenses--percentage").textContent = "--"
      }
    },

    displayPercentageListInUi: function(perArray){
      var p = document.querySelectorAll(domStrings.itemspercantage);
      for(var i=0;i<p.length;i++)
      {
        if(perArray[i]>0){
          p[i].textContent = perArray[i] + "%";
        }
        else{
          p[i].textContent = "--";
        }

      }
    },

    displayCurrentDate: function(){
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth();
      var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      document.querySelector(domStrings.dateElement).textContent = monthArray[month] + " " + year;
    },

    typeInputStyle: function(){
      document.querySelector(domStrings.type).classList.toggle("red-focus");
      document.querySelector(domStrings.discrip).classList.toggle("red-focus");
      document.querySelector(domStrings.valueStr).classList.toggle("red-focus");
      document.querySelector(domStrings.button).classList.toggle("red");


      //var fileds = document.querySelectorAll(domStrings.type + "," + domStrings.discrip + "," + domStrings.valueStr);

    },

    getDOMStrings: function(){
      return domStrings;
    }
  };

})();

var budgetController = (function(){
  var Expence = function(id, dis, val){
    this.id = id,
    this.dis = dis,
    this.val = val
    this.percentage = -1;
  };

  var Income = function(id, dis, val){
    this.id = id,
    this.dis = dis,
    this.val = val
  };

  Expence.prototype.calculatePersentages = function(totalIncome){

    if(totalIncome>0){
      this.percentage = Math.round((this.val/totalIncome) * 100);
    }
    else{
      this.percentage = -1;
    }
  };

  Expence.prototype.getPercantage = function(){
    return this.percentage;
  };


  var data = {
    allItem: {
      exp: [],
      inc : []
    },
    total: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function(typ){
    var sum=0;
    data.allItem[typ].forEach(function(cur){
      sum =sum + cur.val;
    });
    data.total[typ] = sum;
  };

  var iD=0;
  return {
    AddNewItem: function(typ, dis, vl){
      var newItem;
      iD++;
      if(typ === "exp"){
        newItem = new Expence(iD, dis, vl);
      }
      else if(typ === "inc"){
        newItem = new Income(iD, dis, vl);
      }

      data.allItem[typ].push(newItem);
      return newItem;
    },

    calculateBudget: function(){
      //calclate total income & total exp
      calculateTotal("inc");
      calculateTotal("exp");
      //var total = calculateTotal(type);
      //data.total[type] = total;
      //calculate budge///////////
      data.budget = data.total.inc - data.total.exp;
      //calclate expence percentage
      if(data.total.inc !== 0)
      {
        data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
      }

      if(data.total.inc === 0 && data.percentage>0)
      {
        data.percentage = -1;
      }

    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalIncome: data.total.inc,
        totalExpence: data.total.exp,
        percentage: data.percentage
      };
    },

    calPercantage: function(){
      data.allItem.exp.forEach(function(current){
        current.calculatePersentages(data.total.inc);
      });
    },

    getPercantageArray: function(){
      var allPercantages = data.allItem.exp.map(function(current){
        return current.getPercantage();
      });
      return allPercantages;
    },

    deteleItem: function(typ, iD){
      data.allItem[typ].forEach(function(current, index){
        if(current.id === iD)
        {
          data.allItem[typ].splice(index, 1);
        }
      });
    },

    testing: function(){
      console.log(data);
    }
  };

})();

var controller = (function(uiCtrl, budgetCtrl){

  var setEventListners = function(){
    var domStringObj = uiCtrl.getDOMStrings();
    document.querySelector(domStringObj.button).addEventListener("click", ctrlAddItems);
    document.addEventListener("keypress", function(e){
      if(e.keyCode=== 13){
        ctrlAddItems();
      }
    });
    document.querySelector(domStringObj.container).addEventListener("click", ctrlDeleteItems);
    document.querySelector(domStringObj.type).addEventListener("change", uiCtrl.typeInputStyle);
  };

  var updateBudget = function(){
    //add budget in data
    budgetCtrl.calculateBudget();
    //return function for getting data/////only for concept
    var budget = budgetCtrl.getBudget();
    //add budget to ui
    uiCtrl.displayBudgetUI(budget);
  };

  var updatePersentage = function(){
    budgetCtrl.calPercantage();
    var perArr = budgetCtrl.getPercantageArray();
    uiCtrl.displayPercentageListInUi(perArr);


  };

  var ctrlAddItems = function(){
    //get input
    var inputObj = uiCtrl.getInput();

    if(inputObj.description !== "" && !isNaN(inputObj.myValue) && inputObj.myValue>0)
    {
      //save input
      var newItem = budgetCtrl.AddNewItem(inputObj.type, inputObj.description,inputObj.myValue);
      //at result to ui
      uiCtrl.addIteminList(newItem, inputObj.type);
      //clear inputs
      uiCtrl.clearInputField();
      //update budget__
      updateBudget();

      updatePersentage();
    }
  };

  var ctrlDeleteItems = function(event){
    var itemID, split;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      split = itemID.split("-");
      var typ = split[0];
      var id = parseInt(split[1]);

      budgetCtrl.deteleItem(typ, id);

      uiCtrl.deleteItemFromList(itemID);

      updateBudget();

      updatePersentage();

    }


    //delete items from data

    //delete items from list ui

    //update budget and show budget
  };


  return {
    init: function(){
      console.log("app is running");
      uiController.displayCurrentDate();
      setEventListners();
    }
  };
})(uiController, budgetController);

controller.init();
