/*
What the app has to do

1)Handle user input 
-Selecting income / expense
-describing the income / expense
-the value of the income / expense

2)Handle events 
-when user hit the enter key
-when user click the input button

3)Store income type, income description, and income value/ expense type, expense description, and expense value to a Interal data structure

4)Displaying the list of incomes and expenses to the user interface 

5)Calculate the budget 

6)Display the calculated budget to the UI
-basically update the UI after calculating the budget

*/

/*
Structuring the code with MODULES

UI Controller{//User interface related control
    -Display(UPDATE) the calculated budget to the UI
    -Displaying the list of incomes and expense to the user interface
    -Handle user input 
        *Selecting income / expense
        *describing the income / expense
        *the value of the income / expense
}

Data Controller{//Data related control
    -Store income type, income description, and income value/ expense type, expense description, and expense value to a Interal data structure
    -Calculate the budget
}

Global Controller{General control
    -Handle events 
        *when user hit the enter key
        *when user click the input button
}

*/

var budgetController = (function(){
    /*
    Need a Data Structure to store user input
    Each entry of user input has type of expense, its' description, and value 
    [userinput1,userinput2,userinput3.........userinputN]
    Also need total expense and total income
    
    so our data strcuture need to
    1) store user input entries
    2) store the total expense and total income
    
    We will use function constructor instead of object literal because there will be lots of userData
    
    */
    
    //private method to create an Expense type data entry
    var Expense = function(id,description,value){
       this.id = id,
       this.description = description,
       this.value = value,
        this.percentage = -1;
    };
    
    Expense.prototype.calPercent = function(totalIncome){
        
        if(totalIncome > 100){
            this.percentage = Math.round((this.value / totalIncome) * 100) ;   
        }else{
            this.percentage = -1;
        }
        
    };
    
    Expense.prototype.getPercent = function(){
        return this.percentage;
    };
    
    //private method to create an Income type data entry
    var Income = function(id,description,value){
       this.id = id,
       this.description = description,
       this.value = value
    };
    
    var userData = {//data structure to store all the data entries
        
        dataEntry:{ //satisifying 1)
            exp: [],
            inc: []
        },
        
        total:{ //satisfying 2)
            exp: 0,
            inc: 0
            
        },
        
        budget: 0,
        
        percentage: -1
        
    };
  
    
    /*
    Take an input (being exp or inc)
    loop for the exp or inc array and sum up all the value inside
    change the total exp or total inc in the data sturcture userData respectively 
    */
    
    var calTotal = function(type){
        var sum = 0;
    
        userData.dataEntry[type].forEach(function(currentValue){
            sum += currentValue.value;
        });
        
        //change the total exp or inc respectively
        userData.total[type] = sum;
      
    };

    
    
    return{
        addItem: function(userType,userDescrip,userValue){//public method to add item to the internal data structure
            
         
            /*
            To generate a unique ID for each userInput element, we will use the ID of the last element in an array
            and then +1
            
            However, this way of generating an Id will cause an error if the array is 0, so we need to put an if else statement to catch this error by hardcoding an ID when the array is 0
            
            */
            if(userData.dataEntry[userType].length === 0){//if the array is Empty 
                ID = 0;
            }else{
                ID = userData.dataEntry[userType][userData.dataEntry[userType].length - 1].id + 1;
            }
            
            
            if (userType === 'exp'){//if its an expense
                newItem = new Expense(ID,userDescrip,userValue);
            }else{//if its an income
                newItem = new Income(ID,userDescrip,userValue);

            }  
            
            /*
            you can also do userData.dataEntry.exp.push, (or inc.push), but then you will have to hard code it twice
            the follow method lets you use the userType input string to select the according array to store input in
            */
            userData.dataEntry[userType].push(newItem); //adding the new user entry into the according array
            
            return newItem;

        },
        
        deleteItem: function(type, id){
            
            var ids, index;
            
            //id = 6
            //userData.dataEntry[type][id];
            //ids = [1 2 4 6 8]
            //index = 3
            
            /*
            
            map recevies a call back function that has access to the current element, current index, and the entire array
            map returns a brand new away compared to foreach
            
            so what this does is that it return an array of the id of the current element
            while current is looped through each time
            so at the end it has the id of all the element in the array 
            
            so ids is an array
            
            */
            ids = userData.dataEntry[type].map(function(current){
                return current.id;                     
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1){
                userData.dataEntry[type].splice(index, 1);
            }
            
        },
        
        calPercentage: function(){
        
            userData.dataEntry.exp.forEach(function(current){
                current.calPercent(userData.total.inc); 
            });
            
        },
        
        getPercentage: function(){
          
            var allPerc = userData.dataEntry.exp.map(function(current){
                return current.getPercent();
            });
            
            return allPerc;
        },
        
        calBudget: function(){
            //1. Calcualte total income, total expense
            calTotal('exp');
            calTotal('inc');
            
            //2. Calculate Budget (total income - total expense)
            userData.budget = userData.total.inc - userData.total.exp;
            
            //3. Calculate percentage of income we expend
            if (userData.budget <= 0){ //if we have a negative budget (or even), then just set the percentage to -1 (none existed)
                userData.percentage = -1;
            }else{//we have a positive budget, can calculate percentage as usual
                 userData.percentage = Math.round(userData.total.exp / userData.total.inc * 100);
            }
        },
        
        getBudgetInfo: function(){//return a data structure that returns all the property that is related to the budget
            return{
                budget: userData.budget,
                percentage: userData.percentage,
                totalInc: userData.total.inc,
                totalExp: userData.total.exp
            };
        },
        
        testing: function(){
            return userData;
        }
    };
    
})();
    
var UIController = (function(){
    
    //central place storing add the string for querySelector 
    //practically an object
    var DomStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        button: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetIncomeValue: ".budget__income--value",
        budgetExpenseValue: ".budget__expenses--value",
        budgetExpensePercent: ".budget__expenses--percentage",
        budgetValue: ".budget__value",
        container: ".container",
        expensesPercentage: ".item__percentage",
        date: ".budget__title--month"
    };
    
    
      var nodeListForEach = function(nodeList, callBackFunction){
                for (var i = 0;  i < nodeList.length; i++){
                    callBackFunction(nodeList[i], i); //this is where you actually "define" the parameters taken by the callback function
                } 
    };
    
     var formatNumber = function(number, type){
        
            var int, dec, splitNum

            /*

            1) if exp : - , if inc : +

            2) only 2 decmials

            3) comma seperating the number

            */


            //satisfying 2)
            number = Math.abs(number);

            number = number.toFixed(2);

            /*
            how to satisfy 3)

            2000 = 2,000
            21000 = 21,000
            222000 = 222,000

            the comma always appears after 3 numbers counting from the left side

            */

            //first seperate the decmials and the number

            splitNum = number.split('.');

            int = splitNum[0];

            dec = splitNum[1];

            //next add the comma where it is approiate, you only need to add a comma if its in a thousnad, so if the length of the number is >3 or =>4
            
            /*
            
            var str = 'Mozilla';

            console.log(str.substr(1, 2));
            // expected output: "oz"

            console.log(str.substr(2));
            // expected output: "zilla"
            
            */

            if (int.length > 3){
                
                int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
                
            }
             
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 
        };

    //A list of public methods that will be made available
    return{
        getinput: function(){//getInput is a function that returns an object that contains the 3 properties 
            return { 
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)  
            };
        },
        
        getDomStrings: function(){//making the list of DomStrings publicly accesible
            return DomStrings;
        },
        
        addListItem: function(userDataEntry, type){//add userdata input entry to the UI (displaying it in the UI)
            
            
            var html, newHTML,elementList;
            //Create HTML String with placeholder text
            
            if(type === 'inc'){ //income html string
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                elementList = DomStrings.incomeList;
                
                
            }else{ //expense html string
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                elementList = DomStrings.expenseList;
                
            }
            
            //Replace the placeholder text with actual data
            //replace replace a substring within a string
            
            newHTML = html.replace('%id%', userDataEntry.id);
            newHTML = newHTML.replace('%description%', userDataEntry.description);
            newHTML = newHTML.replace('%value%', formatNumber(userDataEntry.value, type));
            
            /*
            Insert the html into the dom
            <!-- beforebegin -->
            <p>
            <!-- afterbegin -->
            foo
            <!-- beforeend -->
            </p>
            <!-- afterend -->
            
            We are selecting the tag of expense list or income list and we want to place the newest item at the bottom of the list, so we are picking beforeend
            
            */
            document.querySelector(elementList).insertAdjacentHTML('beforeend',newHTML);    
        },
        
        deleteListItem: function(selectorID){
            
            //in JS you can't simply delete an elemement, you can only delete a child 
            
            var el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el);
            
        },
        
        
        clearField: function(){
            /*
            
            Things to know
            
            The Document method querySelectorAll() returns a static (not live) NodeList representing a list of the document's elements that match the specified group of selectors.
            
            The slice() method returns a shallow copy of a portion of an array into a new array object 
            
            
            */
            
            var inputField, inputFieldArray;
            
            /*
            Remember querySelector select in a style that is similiar to CSS
            and in CSS if you want to select multiple classes for style you go h1, h2. Hence the ","
            
            We want to clear the input description as well as the value, so we are selecting those 2
            
            So now since querySelectorAll return a NodeList, we can't loop over it using the way we know how to loop over arrays
            
            */
            
            inputField = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);
            
            /*
            using .call to do method borrowing
            Array is a predefined object (like Math) that contains the slice method
            so Array.prototype.slice.call(inputField) let us use the method on the list which then returns an array
            
            Note that we need prototype instead of just Array.slice because Array is a function constructor
            
            if we are calling for an instances of array then we dont need the prototype.
            
            like if we already defined an Array object called arr, then we can just do arr.slice.call
            
            the slice method is stored in the prototype property of Array
            
            */
            inputFieldArray = Array.prototype.slice.call(inputField);
            
            /*
            current = value of the element in the array in the current iteration
            index = value of the index in the current iteration
            array = the targetd array (Which is inputFieldArray in this case)
            
            For each method loops over all the elements in the inputFieldArray
            
            then depends on what we want to do we can use the 3 parmameters to help us
            
            whicn in this case we want the value of the current value of the element to be an empty string 
            
            the .value actually comes the html input tag 
            
            so what we are doing is we select the html tag
            
            and then you use .value to change its' value 
            
            much like document.querySelector(DomStrings.inputDescription).value
            
            */
            
            inputFieldArray.forEach(function(current, index, array){
                current.value = '';
            });
            
            /*
            the inputFieldArray looks like this 
            [inputDescription, inputValue]
            */
            
            inputFieldArray[0].focus(); //putting the focus back on the input description
            
        },
        
        displayBudget: function(budgetData){
            var type;
            budgetData.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DomStrings.budgetValue).textContent = formatNumber(budgetData.budget, type);
            document.querySelector(DomStrings.budgetIncomeValue).textContent = formatNumber(budgetData.totalInc, 'inc');
            document.querySelector(DomStrings.budgetExpenseValue).textContent = formatNumber(budgetData.totalExp, 'exp');
            
            if(budgetData.percentage <=0){ //we don't want to show a -1% 
                document.querySelector(DomStrings.budgetExpensePercent).textContent = '---%';
            }else{//function normally
                document.querySelector(DomStrings.budgetExpensePercent).textContent = budgetData.percentage + '%';
            }
            
        },
        
        displayPercentage: function(percentArray){
            
            //querySelectorAll return a nodeList, so we need to write our own function to loop over this nodeList
            var field = document.querySelectorAll(DomStrings.expensesPercentage);    
            
            /*
            nodeListForEach does this:
            
            it takes in two parameter, 1) is the nodeList you wanna tranverse, 2) the call back function which you wish to use on each element of nodeList each time you tranverse through the element 
            
            so the for loop simply tranverse through the nodelist
            
            then inside the for loop, you invoke the call back function
            
            the call back function takes in the current element and index
            
            so you basically just wrote your own for each function because its doing the same thing 
            
            */
            
            nodeListForEach(field, function(current, index){
                
                if(percentArray[index] > 0){
                    current.textContent = percentArray[index] + '%';
                }else{
                    current.textContent = '---';
                }
                
            });
        },
        
        displayDate: function(){
            var now, month, months, year;
            
            now = new Date();
            
            year = now.getFullYear();
            
            month = now.getMonth();
            
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            document.querySelector(DomStrings.date).textContent = months[month] + ', ' + year;
            
            
        },
        
        changeType: function(){
            
            var fields = document.querySelectorAll(
                DomStrings.inputType + ',' +
                DomStrings.inputDescription + ',' +
                DomStrings.inputValue 
            );
            
            nodeListForEach (fields, function(current){
                current.classList.toggle('red-focus');
            });
            
           var button =  document.querySelector(DomStrings.button);
            button.classList.toggle('red');
        
        }
        
      
    };
    
})();


/*
The Global Controller 
The Global Controller has to pass the value to the budgetController and UI controller after handling the event 
So it has to take the 2 controller has parameters

*/
var Controller = (function(budgetCtrl,UICtrl){
    
    
    var setUpEventListener = function(){
        //Centralized variable for the list of DomStrings
        var DomStrings = UICtrl.getDomStrings();
        
        /*
        handling button clicking events
        we have the type of expense, its' description, and value 
        we want to pass it on to the UI controller to handle the input
        we also want to pass it to the budget controller so it can store it

        Important notes:
        The reason why we do 
        1)document.querySelector(".add__btn").addEventListener('click', ctrlAddItem);

        instead of 

        2)document.querySelector(".add__btn").addEventListener('click', ctrlAddItem());

        1) will only execute ctrlAddItem when the event listener actually listened a click

        2) will execute ctrlAddItem regardless when the line of the code is execute, which is what we dont want 
        */
        document.querySelector(DomStrings.button).addEventListener('click', ctrlAddItem);

        //handling the enter key pressing event, we want the same thing to happen similar to add button
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){// if the key pressed by user is Enter, which for older browsers cases
               ctrlAddItem();
            }
        });
        
        document.querySelector(DomStrings.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DomStrings.inputType).addEventListener('change', UICtrl.changeType);
        

    };
    
    
    
    /*
    we can calculate the budget internally and store everything inside the budget controller
    However, we also need to update it in the UI (displaying the budget and percentage and such)
    Therefore, we need to return the following to pass it to the UI controller for further UI control:
    1) The total budget
    2) The total percentage
    3) The total Income
    4) the Total Expense
    
    So we need a new function to store all of the above...
    */
    
    var updateBudget = function(){
        //1. Calculate the budget
        budgetCtrl.calBudget();
        
        //2. Return the budget and its related information
        var budgetInfo = budgetCtrl.getBudgetInfo();
        
        //3. Update the budget and display it on the UI
        UICtrl.displayBudget(budgetInfo);
        
    };
    
    var updatePercentage = function(){
        
        //1. Calculate the percentage
        budgetCtrl.calPercentage();
        
        //2. Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentage();
        
        //3. Update the UI with the new percentage
        UICtrl.displayPercentage(percentages);
        
        
    
    };
    
    
    
     /*
    a general function that does 1. - 5.
    ctrlAddItem is called whenever we pressed enter or we clicked the button
    */
    var ctrlAddItem = function(){
            
        
        var input, newItem;
        /*
        1. Get the input data
        Passing the user input directly to the UI
        Or you can look at it as telling the UI controller to store these user input data
        */
        input = UICtrl.getinput();
        
        
         /*
         
        Before we proceed to 2.
            
        We need to prevent the user from adding invalid entires to the data structure
            
        Invalid data entries:
            
            1) no description
            2) String as the value or no number in the value (both can be handle with NAN)
            
        We only want 2-6 to execute if 
        
        a) the input description is not empty AND
        b) if the input value is a number AND
        c) the input value can't be 0 or negative
        
        Note that you could do it in the addItem function under budgetCtrl, but then you will not return anything as newItem
        then you pass it to UICtrl.addListITem will probably cause an error, then you gonna have to write the exact same if statement to take care of it.
        
        So its better to put it here since we only want 2-6 to execute when the user enter a valid input 
        
        */
            
        if (input.description != '' && !isNaN(input.value) && input.value > 0){
            
             //2. Add it to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add it to the UI Controller

            UICtrl.addListItem(newItem,input.type);

            //4. Clear Input Field

            UICtrl.clearField();

            //5. Calculate the budget 
            //6. Update the budget on the UI (dispaying it)
            updateBudget();
            
            //7. Calculate and update Percentage
            updatePercentage();
            
            
        }
            

       
    };
    
    var ctrlDeleteItem = function(event){
        
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        
        //1. Delete Item from data structure
        
        budgetCtrl.deleteItem(type, ID);
        
        //2. Delete Item from the UI
        
        UICtrl.deleteListItem(itemID);
        
        //3. Update and show the new budget
        
        updateBudget();
        
        //4. Calculate and update Percentage
        
        updatePercentage();
    };
    
    return{//list of public methods
        /*
        the init function returns a function -> setUpEventListener
        Due to closure, the init function always have access to the function setUpEventListener 
        */
        init: function(){
            setUpEventListener();
            
            UICtrl.displayDate();
            
            //feeding a dummby object that has the same varaibale name required by the displayBudget info but set all the value to its appriorate initial status / number
            
            UICtrl.displayBudget({ 
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '---'
            })
        }
    };
    
    
})(budgetController,UIController);

Controller.init();
