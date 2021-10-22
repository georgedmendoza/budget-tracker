// holds db connection 
let db;
// establish connectin to Indexeddb, called 'budget-tracker'
const request = indexedDB.open('budget-tracker', 1);

// if case db version changes or doesn't exist
request.onupgradeneeded = function(event) {
    // save ref too db
    const db = event.target.result;
    // new oject store(table) new_fund, set to auto increment and primary key
    db.createObjectStore('new_fund', { autoIncrement: true });
}

// when successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run function
    if(navigator.onLine) {
        uploadFund();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// executed when submit is attempted, but no iternet connection
function saveRecord(fund) {
    // open new transaction w/ db w/ read and write permession
    const transaction = db.transaction(['new_fund'], 'readwrite');
    // access obj store for new_fund
    const fundObjectStore = transaction.objectStore('new_fund');
    // add record to my store with add method
    fundObjectStore.add(fund);
}

function uploadFund() {
    // open transaction on db
    const transaction = db.transaction(['new_fund'], 'readwrite');
    // access object sotre
    const fundObjectStore = transaction.objectStore('new_fund');
    // get all records from store and set to a variable
    const getAll = fundObjectStore.getAll();

    // upon a successful .getAll() execution, run this function 
    getAll.onsuccess = function() {
    // if there is data in indexedDB then send to api server
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(transaction),
                headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_fund'], 'readwrite');
                // access new_fund obj store
                const fundObjectStore = transaction.objectStore('new_fund');
                // clear all items in store
                fundObjectStore.clear();

                alert('All funds saved and submitted!')
            })
            .catch(err => {
                console.log(err);
            })
        }
    };
}


// listen for app coming back online
window.addEventListener('online', uploadFund);