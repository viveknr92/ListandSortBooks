# ListandSortBooks

Build a service that when called will return list of books that the UI can display. Each book in the list should contain:
 
1.	A URL for the book thumbnail.
2.	Title of the Book.
3.	Author of the Book.
4.	Price of the Book.
5.	Availability of the Book.
 
Also your service should be able to take 2 params, column name to sort and the sort order. 

If those 2 are not provided default to Title of the Book as column and Ascending order as the sort order.

APIs :

List books sorted by title in aesc order:
GET /books

List books sorted by given column_name and order:
GET /books?sort={order}&col={column_name}
order : {aesc, desc}
column_name : {title, author, price, availability}

Create new book resource:
POST /books
{
    "title":"title",
    "author":"author",
    "price":"100",
    "availability":"Y",
    "url":"url"
}

Update book resource:
PUT /books/id
{
    "title":"title",
    "author":"author",
    "price":"100",
    "availability":"Y",
    "url":"url"
}

Delete book resource:
DELETE /books/id
