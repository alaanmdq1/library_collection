//class

class Book{

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {

    static showBooks(){
        const books = Data.getBooks();
        books.forEach((book) => UI.addBookList(book));
    }

    static addBookList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBookList(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }

    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() =>document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Data {

    static getBooks(){
        let books = [];
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static postBook(book){
        const books = Data.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn){
        const books = Data.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

//page load function

document.addEventListener('DOMContentLoaded', UI.showBooks());

//control submit event

document.querySelector('#book-form').addEventListener('submit', (e) =>{
    e.preventDefault();

    //get value from fields

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value; 

    if(title === '' || author === '' || isbn === '' ){
        UI.showAlert('Please complete the form', 'danger');
    } else {
        const book = new Book(title, author, isbn);
        Data.postBook(book);
        UI.addBookList(book);
        UI.showAlert('Book added successfully', 'success');
        UI.clearFields();
    }
});

document.querySelector('#book-list').addEventListener('click', (e) =>{
    UI.deleteBookList(e.target);
    Data.deleteBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book deleted', 'success');
});