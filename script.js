// Singleton Pattern for Library
class Library {
    static instance = null;

    static getInstance() {
        if (!Library.instance) {
            Library.instance = new Library();
        }
        return Library.instance;
    }

    constructor() {
        if (Library.instance) {
            return Library.instance;
        }
        this.books = this.getInitialBooks();
        this.observers = [];
        this.cache = new LRUCache(100); // Cache for 100 most recent books
        this.searchTrie = new Trie(); // For search suggestions
        this.initializeSearchTrie();
        Library.instance = this;
    }

    // Observer Pattern
    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update());
    }

    // Factory Pattern for Book Creation
    createBook(bookData) {
        return new Book(bookData);
    }

    // Strategy Pattern for Sorting
    setSortStrategy(strategy) {
        this.sortStrategy = strategy;
    }

    sortBooks() {
        return this.sortStrategy.sort(this.books);
    }

    // Binary Search Implementation
    findBookByISBN(isbn) {
        const sortedBooks = [...this.books].sort((a, b) => a.isbn.localeCompare(b.isbn));
        let left = 0;
        let right = sortedBooks.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (sortedBooks[mid].isbn === isbn) {
                return sortedBooks[mid];
            }
            if (sortedBooks[mid].isbn < isbn) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return null;
    }

    // Initialize Trie for Search Suggestions
    initializeSearchTrie() {
        this.books.forEach(book => {
            this.searchTrie.insert(book.title.toLowerCase());
            this.searchTrie.insert(book.author.toLowerCase());
        });
    }

    // Get Search Suggestions
    getSearchSuggestions(prefix) {
        return this.searchTrie.getSuggestions(prefix.toLowerCase());
    }

    // Book Recommendation System
    getRecommendations(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return [];

        // Simple recommendation based on category and author
        return this.books
            .filter(b => b.id !== bookId && (b.category === book.category || b.author === book.author))
            .sort((a, b) => {
                const scoreA = (a.category === book.category ? 2 : 0) + (a.author === book.author ? 1 : 0);
                const scoreB = (b.category === book.category ? 2 : 0) + (b.author === book.author ? 1 : 0);
                return scoreB - scoreA;
            })
            .slice(0, 5);
    }

    // Heap Sort implementation
    heapSort(books, key) {
        const n = books.length;
        
        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(books, n, i, key);
        }
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            [books[0], books[i]] = [books[i], books[0]];
            
            // Call heapify on the reduced heap
            this.heapify(books, i, 0, key);
        }
        
        return books;
    }
    
    heapify(books, n, i, key) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        // Compare with left child
        if (left < n && this.compare(books[left], books[largest], key) > 0) {
            largest = left;
        }
        
        // Compare with right child
        if (right < n && this.compare(books[right], books[largest], key) > 0) {
            largest = right;
        }
        
        // If largest is not root
        if (largest !== i) {
            [books[i], books[largest]] = [books[largest], books[i]];
            
            // Recursively heapify the affected sub-tree
            this.heapify(books, n, largest, key);
        }
    }
    
    compare(a, b, key) {
        if (key === 'publishedYear') {
            return a[key] - b[key];
        }
        return a[key].localeCompare(b[key]);
    }
    
    sortBooks(sortBy) {
        const booksCopy = [...this.books];
        return this.heapSort(booksCopy, sortBy);
    }

    getInitialBooks() {
        return [
            // Fiction Books
            {
                id: 1,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                category: "Fiction",
                isbn: "978-0743273565",
                status: "available",
                description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                publishedYear: 1925
            },
            {
                id: 2,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                category: "Fiction",
                isbn: "978-0446310789",
                status: "available",
                description: "The story of racial injustice and the loss of innocence in the American South.",
                publishedYear: 1960
            },
            {
                id: 3,
                title: "1984",
                author: "George Orwell",
                category: "Fiction",
                isbn: "978-0451524935",
                status: "available",
                description: "A dystopian social science fiction novel and cautionary tale.",
                publishedYear: 1949
            },
            {
                id: 4,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                category: "Fiction",
                isbn: "978-0141439518",
                status: "available",
                description: "A romantic novel of manners.",
                publishedYear: 1813
            },
            {
                id: 5,
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                category: "Fiction",
                isbn: "978-0316769488",
                status: "available",
                description: "A classic coming-of-age story.",
                publishedYear: 1951
            },
            // Science Books
            {
                id: 6,
                title: "A Brief History of Time",
                author: "Stephen Hawking",
                category: "Science",
                isbn: "978-0553380163",
                status: "available",
                description: "A landmark volume in science writing by one of the great minds of our time.",
                publishedYear: 1988
            },
            {
                id: 7,
                title: "The Selfish Gene",
                author: "Richard Dawkins",
                category: "Science",
                isbn: "978-0198788607",
                status: "available",
                description: "A book on evolution that explains how natural selection works at the genetic level.",
                publishedYear: 1976
            },
            {
                id: 8,
                title: "Cosmos",
                author: "Carl Sagan",
                category: "Science",
                isbn: "978-0345539435",
                status: "available",
                description: "A personal voyage through the universe.",
                publishedYear: 1980
            },
            {
                id: 9,
                title: "The Elegant Universe",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0393338102",
                status: "available",
                description: "An exploration of string theory and the search for the ultimate theory.",
                publishedYear: 1999
            },
            {
                id: 10,
                title: "The Gene: An Intimate History",
                author: "Siddhartha Mukherjee",
                category: "Science",
                isbn: "978-1476733500",
                status: "available",
                description: "A history of the gene and a vision of the future of human genetics.",
                publishedYear: 2016
            },
            // History Books
            {
                id: 11,
                title: "Sapiens: A Brief History of Humankind",
                author: "Yuval Noah Harari",
                category: "History",
                isbn: "978-0062316097",
                status: "available",
                description: "A groundbreaking narrative of humanity's creation and evolution.",
                publishedYear: 2014
            },
            {
                id: 12,
                title: "Guns, Germs, and Steel",
                author: "Jared Diamond",
                category: "History",
                isbn: "978-0393317558",
                status: "available",
                description: "A short history of everybody for the last 13,000 years.",
                publishedYear: 1997
            },
            {
                id: 13,
                title: "The History of the Ancient World",
                author: "Susan Wise Bauer",
                category: "History",
                isbn: "978-0393059748",
                status: "available",
                description: "From the earliest accounts to the fall of Rome.",
                publishedYear: 2007
            },
            {
                id: 14,
                title: "The Silk Roads",
                author: "Peter Frankopan",
                category: "History",
                isbn: "978-1101912379",
                status: "available",
                description: "A new history of the world.",
                publishedYear: 2015
            },
            {
                id: 15,
                title: "SPQR: A History of Ancient Rome",
                author: "Mary Beard",
                category: "History",
                isbn: "978-0871404637",
                status: "available",
                description: "A comprehensive history of ancient Rome.",
                publishedYear: 2015
            },
            // Non-Fiction Books
            {
                id: 16,
                title: "Thinking, Fast and Slow",
                author: "Daniel Kahneman",
                category: "Non-Fiction",
                isbn: "978-0374533557",
                status: "available",
                description: "A major work about the way we think and make decisions.",
                publishedYear: 2011
            },
            {
                id: 17,
                title: "The Power of Habit",
                author: "Charles Duhigg",
                category: "Non-Fiction",
                isbn: "978-0812981605",
                status: "available",
                description: "Why we do what we do in life and business.",
                publishedYear: 2012
            },
            {
                id: 18,
                title: "Outliers",
                author: "Malcolm Gladwell",
                category: "Non-Fiction",
                isbn: "978-0316017923",
                status: "available",
                description: "The story of success.",
                publishedYear: 2008
            },
            {
                id: 19,
                title: "The 7 Habits of Highly Effective People",
                author: "Stephen R. Covey",
                category: "Non-Fiction",
                isbn: "978-0743269513",
                status: "available",
                description: "Powerful lessons in personal change.",
                publishedYear: 1989
            },
            {
                id: 20,
                title: "Atomic Habits",
                author: "James Clear",
                category: "Non-Fiction",
                isbn: "978-0735211292",
                status: "available",
                description: "An easy and proven way to build good habits and break bad ones.",
                publishedYear: 2018
            },
            // More Fiction Books
            {
                id: 21,
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                category: "Fiction",
                isbn: "978-0544003415",
                status: "available",
                description: "An epic high-fantasy novel and one of the best-selling books ever written.",
                publishedYear: 1954
            },
            {
                id: 22,
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                category: "Fiction",
                isbn: "978-0547928227",
                status: "available",
                description: "A fantasy novel and children's book by English author J.R.R. Tolkien.",
                publishedYear: 1937
            },
            {
                id: 23,
                title: "The Alchemist",
                author: "Paulo Coelho",
                category: "Fiction",
                isbn: "978-0062315007",
                status: "available",
                description: "A philosophical novel by Brazilian author Paulo Coelho.",
                publishedYear: 1988
            },
            {
                id: 24,
                title: "The Little Prince",
                author: "Antoine de Saint-Exupéry",
                category: "Fiction",
                isbn: "978-0156013987",
                status: "available",
                description: "A poetic tale about a young prince who visits various planets in space.",
                publishedYear: 1943
            },
            {
                id: 25,
                title: "The Kite Runner",
                author: "Khaled Hosseini",
                category: "Fiction",
                isbn: "978-1594631931",
                status: "available",
                description: "A story of friendship, betrayal, and redemption set in Afghanistan.",
                publishedYear: 2003
            },
            // More Science Books
            {
                id: 26,
                title: "The Origin of Species",
                author: "Charles Darwin",
                category: "Science",
                isbn: "978-0451529060",
                status: "available",
                description: "The foundation of evolutionary biology.",
                publishedYear: 1859
            },
            {
                id: 27,
                title: "The Double Helix",
                author: "James D. Watson",
                category: "Science",
                isbn: "978-0743216302",
                status: "available",
                description: "A personal account of the discovery of the structure of DNA.",
                publishedYear: 1968
            },
            {
                id: 28,
                title: "The Emperor of All Maladies",
                author: "Siddhartha Mukherjee",
                category: "Science",
                isbn: "978-1439170915",
                status: "available",
                description: "A biography of cancer.",
                publishedYear: 2010
            },
            {
                id: 29,
                title: "The Sixth Extinction",
                author: "Elizabeth Kolbert",
                category: "Science",
                isbn: "978-0805092998",
                status: "available",
                description: "An account of the ongoing mass extinction of species.",
                publishedYear: 2014
            },
            {
                id: 30,
                title: "The Hidden Life of Trees",
                author: "Peter Wohlleben",
                category: "Science",
                isbn: "978-1771642484",
                status: "available",
                description: "What they feel, how they communicate.",
                publishedYear: 2015
            },
            // More History Books
            {
                id: 31,
                title: "The Rise and Fall of the Third Reich",
                author: "William L. Shirer",
                category: "History",
                isbn: "978-1451651683",
                status: "available",
                description: "A history of Nazi Germany.",
                publishedYear: 1960
            },
            {
                id: 32,
                title: "The Guns of August",
                author: "Barbara W. Tuchman",
                category: "History",
                isbn: "978-0345476098",
                status: "available",
                description: "A history of the first month of World War I.",
                publishedYear: 1962
            },
            {
                id: 33,
                title: "The Wright Brothers",
                author: "David McCullough",
                category: "History",
                isbn: "978-1476728742",
                status: "available",
                description: "The story of the two brothers who invented the airplane.",
                publishedYear: 2015
            },
            {
                id: 34,
                title: "The Warmth of Other Suns",
                author: "Isabel Wilkerson",
                category: "History",
                isbn: "978-0679763888",
                status: "available",
                description: "The epic story of America's great migration.",
                publishedYear: 2010
            },
            {
                id: 35,
                title: "The Swerve",
                author: "Stephen Greenblatt",
                category: "History",
                isbn: "978-0393343403",
                status: "available",
                description: "How the world became modern.",
                publishedYear: 2011
            },
            // More Non-Fiction Books
            {
                id: 36,
                title: "Sapiens",
                author: "Yuval Noah Harari",
                category: "Non-Fiction",
                isbn: "978-0062316097",
                status: "available",
                description: "A brief history of humankind.",
                publishedYear: 2014
            },
            {
                id: 37,
                title: "The Immortal Life of Henrietta Lacks",
                author: "Rebecca Skloot",
                category: "Non-Fiction",
                isbn: "978-1400052189",
                status: "available",
                description: "The story of the first immortal human cells.",
                publishedYear: 2010
            },
            {
                id: 38,
                title: "The New Jim Crow",
                author: "Michelle Alexander",
                category: "Non-Fiction",
                isbn: "978-1595586438",
                status: "available",
                description: "Mass incarceration in the age of colorblindness.",
                publishedYear: 2010
            },
            {
                id: 39,
                title: "The Righteous Mind",
                author: "Jonathan Haidt",
                category: "Non-Fiction",
                isbn: "978-0307455772",
                status: "available",
                description: "Why good people are divided by politics and religion.",
                publishedYear: 2012
            },
            {
                id: 40,
                title: "The Better Angels of Our Nature",
                author: "Steven Pinker",
                category: "Non-Fiction",
                isbn: "978-0143122012",
                status: "available",
                description: "Why violence has declined.",
                publishedYear: 2011
            },
            // More Fiction Books
            {
                id: 41,
                title: "One Hundred Years of Solitude",
                author: "Gabriel García Márquez",
                category: "Fiction",
                isbn: "978-0060883287",
                status: "available",
                description: "A magical realist novel that tells the story of the Buendía family.",
                publishedYear: 1967
            },
            {
                id: 42,
                title: "The Brothers Karamazov",
                author: "Fyodor Dostoevsky",
                category: "Fiction",
                isbn: "978-0374528379",
                status: "available",
                description: "A philosophical novel set in 19th-century Russia.",
                publishedYear: 1880
            },
            {
                id: 43,
                title: "The Count of Monte Cristo",
                author: "Alexandre Dumas",
                category: "Fiction",
                isbn: "978-0140449266",
                status: "available",
                description: "A tale of revenge and redemption.",
                publishedYear: 1844
            },
            {
                id: 44,
                title: "The Picture of Dorian Gray",
                author: "Oscar Wilde",
                category: "Fiction",
                isbn: "978-0141439570",
                status: "available",
                description: "A philosophical novel about beauty and morality.",
                publishedYear: 1890
            },
            {
                id: 45,
                title: "The Metamorphosis",
                author: "Franz Kafka",
                category: "Fiction",
                isbn: "978-0553213690",
                status: "available",
                description: "A story about a man who wakes up transformed into a giant insect.",
                publishedYear: 1915
            },
            // More Science Books
            {
                id: 46,
                title: "The Feynman Lectures on Physics",
                author: "Richard Feynman",
                category: "Science",
                isbn: "978-0465023820",
                status: "available",
                description: "A series of lectures on physics.",
                publishedYear: 1964
            },
            {
                id: 47,
                title: "The Blind Watchmaker",
                author: "Richard Dawkins",
                category: "Science",
                isbn: "978-0393315707",
                status: "available",
                description: "Why the evidence of evolution reveals a universe without design.",
                publishedYear: 1986
            },
            {
                id: 48,
                title: "The Demon-Haunted World",
                author: "Carl Sagan",
                category: "Science",
                isbn: "978-0345409461",
                status: "available",
                description: "Science as a candle in the dark.",
                publishedYear: 1995
            },
            {
                id: 49,
                title: "The Structure of Scientific Revolutions",
                author: "Thomas S. Kuhn",
                category: "Science",
                isbn: "978-0226458120",
                status: "available",
                description: "A landmark in intellectual history.",
                publishedYear: 1962
            },
            {
                id: 50,
                title: "The Man Who Mistook His Wife for a Hat",
                author: "Oliver Sacks",
                category: "Science",
                isbn: "978-0684853949",
                status: "available",
                description: "Clinical tales of neurological disorders.",
                publishedYear: 1985
            },
            // More History Books
            {
                id: 51,
                title: "The History of the Decline and Fall of the Roman Empire",
                author: "Edward Gibbon",
                category: "History",
                isbn: "978-0140437645",
                status: "available",
                description: "A monumental work of historical scholarship.",
                publishedYear: 1776
            },
            {
                id: 52,
                title: "The Making of the Atomic Bomb",
                author: "Richard Rhodes",
                category: "History",
                isbn: "978-1451677614",
                status: "available",
                description: "The definitive history of the atomic bomb.",
                publishedYear: 1986
            },
            {
                id: 53,
                title: "The Civil War: A Narrative",
                author: "Shelby Foote",
                category: "History",
                isbn: "978-0394749131",
                status: "available",
                description: "A comprehensive history of the American Civil War.",
                publishedYear: 1958
            },
            {
                id: 54,
                title: "The Path Between the Seas",
                author: "David McCullough",
                category: "History",
                isbn: "978-0743200135",
                status: "available",
                description: "The creation of the Panama Canal.",
                publishedYear: 1977
            },
            {
                id: 55,
                title: "The Discoverers",
                author: "Daniel J. Boorstin",
                category: "History",
                isbn: "978-0394726255",
                status: "available",
                description: "A history of man's search to know his world and himself.",
                publishedYear: 1983
            },
            // More Non-Fiction Books
            {
                id: 56,
                title: "The Art of War",
                author: "Sun Tzu",
                category: "Non-Fiction",
                isbn: "978-0140439199",
                status: "available",
                description: "An ancient Chinese military treatise.",
                publishedYear: -500
            },
            {
                id: 57,
                title: "Meditations",
                author: "Marcus Aurelius",
                category: "Non-Fiction",
                isbn: "978-0812968255",
                status: "available",
                description: "Personal writings of the Roman Emperor.",
                publishedYear: 180
            },
            {
                id: 58,
                title: "The Republic",
                author: "Plato",
                category: "Non-Fiction",
                isbn: "978-0872201361",
                status: "available",
                description: "A Socratic dialogue about justice.",
                publishedYear: -380
            },
            {
                id: 59,
                title: "The Prince",
                author: "Niccolò Machiavelli",
                category: "Non-Fiction",
                isbn: "978-0140449150",
                status: "available",
                description: "A political treatise on how to acquire and maintain political power.",
                publishedYear: 1532
            },
            {
                id: 60,
                title: "The Wealth of Nations",
                author: "Adam Smith",
                category: "Non-Fiction",
                isbn: "978-0140432084",
                status: "available",
                description: "The foundation of modern economics.",
                publishedYear: 1776
            },
            // More Fiction Books
            {
                id: 61,
                title: "The Divine Comedy",
                author: "Dante Alighieri",
                category: "Fiction",
                isbn: "978-0141197494",
                status: "available",
                description: "An epic poem describing the journey through Hell, Purgatory, and Paradise.",
                publishedYear: 1320
            },
            {
                id: 62,
                title: "Don Quixote",
                author: "Miguel de Cervantes",
                category: "Fiction",
                isbn: "978-0060934347",
                status: "available",
                description: "The story of a man who reads too many chivalric romances.",
                publishedYear: 1605
            },
            {
                id: 63,
                title: "War and Peace",
                author: "Leo Tolstoy",
                category: "Fiction",
                isbn: "978-0140447934",
                status: "available",
                description: "A novel that chronicles the French invasion of Russia.",
                publishedYear: 1869
            },
            {
                id: 64,
                title: "The Odyssey",
                author: "Homer",
                category: "Fiction",
                isbn: "978-0140268867",
                status: "available",
                description: "One of the oldest works of Western literature.",
                publishedYear: -800
            },
            {
                id: 65,
                title: "The Iliad",
                author: "Homer",
                category: "Fiction",
                isbn: "978-0140275360",
                status: "available",
                description: "An ancient Greek epic poem.",
                publishedYear: -800
            },
            // More Science Books
            {
                id: 66,
                title: "The Feynman Lectures on Physics",
                author: "Richard Feynman",
                category: "Science",
                isbn: "978-0465023820",
                status: "available",
                description: "A series of lectures on physics.",
                publishedYear: 1964
            },
            {
                id: 67,
                title: "The Elegant Universe",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0393338102",
                status: "available",
                description: "An exploration of string theory.",
                publishedYear: 1999
            },
            {
                id: 68,
                title: "The Fabric of the Cosmos",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0375727207",
                status: "available",
                description: "Space, time, and the texture of reality.",
                publishedYear: 2004
            },
            {
                id: 69,
                title: "The Hidden Reality",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0307278128",
                status: "available",
                description: "Parallel universes and the deep laws of the cosmos.",
                publishedYear: 2011
            },
            {
                id: 70,
                title: "The Grand Design",
                author: "Stephen Hawking",
                category: "Science",
                isbn: "978-0553805376",
                status: "available",
                description: "New answers to the ultimate questions of life.",
                publishedYear: 2010
            },
            // More History Books
            {
                id: 71,
                title: "The Histories",
                author: "Herodotus",
                category: "History",
                isbn: "978-0140449082",
                status: "available",
                description: "The first major work of history in Western literature.",
                publishedYear: -440
            },
            {
                id: 72,
                title: "The Peloponnesian War",
                author: "Thucydides",
                category: "History",
                isbn: "978-0140440393",
                status: "available",
                description: "A historical account of the Peloponnesian War.",
                publishedYear: -400
            },
            {
                id: 73,
                title: "The History of the Ancient World",
                author: "Susan Wise Bauer",
                category: "History",
                isbn: "978-0393059748",
                status: "available",
                description: "From the earliest accounts to the fall of Rome.",
                publishedYear: 2007
            },
            {
                id: 74,
                title: "The History of the Medieval World",
                author: "Susan Wise Bauer",
                category: "History",
                isbn: "978-0393059755",
                status: "available",
                description: "From the conversion of Constantine to the First Crusade.",
                publishedYear: 2010
            },
            {
                id: 75,
                title: "The History of the Renaissance World",
                author: "Susan Wise Bauer",
                category: "History",
                isbn: "978-0393059762",
                status: "available",
                description: "From the rediscovery of Aristotle to the conquest of Constantinople.",
                publishedYear: 2013
            },
            // More Non-Fiction Books
            {
                id: 76,
                title: "The Nicomachean Ethics",
                author: "Aristotle",
                category: "Non-Fiction",
                isbn: "978-0199213610",
                status: "available",
                description: "A philosophical inquiry into the nature of the good life.",
                publishedYear: -350
            },
            {
                id: 77,
                title: "The Confessions",
                author: "Saint Augustine",
                category: "Non-Fiction",
                isbn: "978-0199537822",
                status: "available",
                description: "An autobiographical work by Saint Augustine.",
                publishedYear: 397
            },
            {
                id: 78,
                title: "The Summa Theologica",
                author: "Thomas Aquinas",
                category: "Non-Fiction",
                isbn: "978-0870610635",
                status: "available",
                description: "A comprehensive systematic exposition of theology.",
                publishedYear: 1274
            },
            {
                id: 79,
                title: "The Social Contract",
                author: "Jean-Jacques Rousseau",
                category: "Non-Fiction",
                isbn: "978-0140442014",
                status: "available",
                description: "A book about the legitimacy of the authority of the state over the individual.",
                publishedYear: 1762
            },
            {
                id: 80,
                title: "The Critique of Pure Reason",
                author: "Immanuel Kant",
                category: "Non-Fiction",
                isbn: "978-0521657297",
                status: "available",
                description: "A philosophical work that attempts to reconcile rationalism and empiricism.",
                publishedYear: 1781
            },
            // Final batch of books
            {
                id: 81,
                title: "The Interpretation of Dreams",
                author: "Sigmund Freud",
                category: "Non-Fiction",
                isbn: "978-0465019779",
                status: "available",
                description: "A book that introduces Freud's theory of the unconscious.",
                publishedYear: 1899
            },
            {
                id: 82,
                title: "The Structure of Scientific Revolutions",
                author: "Thomas S. Kuhn",
                category: "Science",
                isbn: "978-0226458120",
                status: "available",
                description: "A landmark in intellectual history.",
                publishedYear: 1962
            },
            {
                id: 83,
                title: "The Origin of Species",
                author: "Charles Darwin",
                category: "Science",
                isbn: "978-0451529060",
                status: "available",
                description: "The foundation of evolutionary biology.",
                publishedYear: 1859
            },
            {
                id: 84,
                title: "The Communist Manifesto",
                author: "Karl Marx",
                category: "Non-Fiction",
                isbn: "978-0140447576",
                status: "available",
                description: "A political pamphlet that presents an analytical approach to class struggle.",
                publishedYear: 1848
            },
            {
                id: 85,
                title: "The Art of War",
                author: "Sun Tzu",
                category: "Non-Fiction",
                isbn: "978-0140439199",
                status: "available",
                description: "An ancient Chinese military treatise.",
                publishedYear: -500
            },
            {
                id: 86,
                title: "The Republic",
                author: "Plato",
                category: "Non-Fiction",
                isbn: "978-0872201361",
                status: "available",
                description: "A Socratic dialogue about justice.",
                publishedYear: -380
            },
            {
                id: 87,
                title: "The Prince",
                author: "Niccolò Machiavelli",
                category: "Non-Fiction",
                isbn: "978-0140449150",
                status: "available",
                description: "A political treatise on how to acquire and maintain political power.",
                publishedYear: 1532
            },
            {
                id: 88,
                title: "The Wealth of Nations",
                author: "Adam Smith",
                category: "Non-Fiction",
                isbn: "978-0140432084",
                status: "available",
                description: "The foundation of modern economics.",
                publishedYear: 1776
            },
            {
                id: 89,
                title: "The Divine Comedy",
                author: "Dante Alighieri",
                category: "Fiction",
                isbn: "978-0141197494",
                status: "available",
                description: "An epic poem describing the journey through Hell, Purgatory, and Paradise.",
                publishedYear: 1320
            },
            {
                id: 90,
                title: "Don Quixote",
                author: "Miguel de Cervantes",
                category: "Fiction",
                isbn: "978-0060934347",
                status: "available",
                description: "The story of a man who reads too many chivalric romances.",
                publishedYear: 1605
            },
            {
                id: 91,
                title: "War and Peace",
                author: "Leo Tolstoy",
                category: "Fiction",
                isbn: "978-0140447934",
                status: "available",
                description: "A novel that chronicles the French invasion of Russia.",
                publishedYear: 1869
            },
            {
                id: 92,
                title: "The Odyssey",
                author: "Homer",
                category: "Fiction",
                isbn: "978-0140268867",
                status: "available",
                description: "One of the oldest works of Western literature.",
                publishedYear: -800
            },
            {
                id: 93,
                title: "The Iliad",
                author: "Homer",
                category: "Fiction",
                isbn: "978-0140275360",
                status: "available",
                description: "An ancient Greek epic poem.",
                publishedYear: -800
            },
            {
                id: 94,
                title: "The Feynman Lectures on Physics",
                author: "Richard Feynman",
                category: "Science",
                isbn: "978-0465023820",
                status: "available",
                description: "A series of lectures on physics.",
                publishedYear: 1964
            },
            {
                id: 95,
                title: "The Elegant Universe",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0393338102",
                status: "available",
                description: "An exploration of string theory.",
                publishedYear: 1999
            },
            {
                id: 96,
                title: "The Fabric of the Cosmos",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0375727207",
                status: "available",
                description: "Space, time, and the texture of reality.",
                publishedYear: 2004
            },
            {
                id: 97,
                title: "The Hidden Reality",
                author: "Brian Greene",
                category: "Science",
                isbn: "978-0307278128",
                status: "available",
                description: "Parallel universes and the deep laws of the cosmos.",
                publishedYear: 2011
            },
            {
                id: 98,
                title: "The Grand Design",
                author: "Stephen Hawking",
                category: "Science",
                isbn: "978-0553805376",
                status: "available",
                description: "New answers to the ultimate questions of life.",
                publishedYear: 2010
            },
            {
                id: 99,
                title: "The Histories",
                author: "Herodotus",
                category: "History",
                isbn: "978-0140449082",
                status: "available",
                description: "The first major work of history in Western literature.",
                publishedYear: -440
            },
            {
                id: 100,
                title: "The Peloponnesian War",
                author: "Thucydides",
                category: "History",
                isbn: "978-0140440393",
                status: "available",
                description: "A historical account of the Peloponnesian War.",
                publishedYear: -400
            }
        ];
    }

    addBook(book) {
        this.books.push({
            ...book,
            id: Date.now(),
            status: 'available'
        });
        this.saveToLocalStorage();
    }

    removeBook(id) {
        this.books = this.books.filter(book => book.id !== id);
        this.saveToLocalStorage();
    }

    toggleBookStatus(id) {
        const book = this.books.find(book => book.id === id);
        if (book) {
            book.status = book.status === 'available' ? 'borrowed' : 'available';
            this.saveToLocalStorage();
        }
    }

    searchBooks(query) {
        query = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.isbn.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query)
        );
    }

    filterBooks(category, availability) {
        return this.books.filter(book => {
            const categoryMatch = !category || book.category === category;
            const availabilityMatch = !availability || book.status === availability;
            return categoryMatch && availabilityMatch;
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }
}

// LRU Cache Implementation
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
}

// Trie Implementation for Search Suggestions
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    getSuggestions(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return this.getAllWords(node, prefix);
    }

    getAllWords(node, prefix) {
        const words = [];
        if (node.isEndOfWord) words.push(prefix);
        for (const [char, childNode] of Object.entries(node.children)) {
            words.push(...this.getAllWords(childNode, prefix + char));
        }
        return words;
    }
}

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

// Sorting Strategies
class SortStrategy {
    sort(books) {
        throw new Error('Sort method must be implemented');
    }
}

class TitleSortStrategy extends SortStrategy {
    sort(books) {
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
    }
}

class AuthorSortStrategy extends SortStrategy {
    sort(books) {
        return [...books].sort((a, b) => a.author.localeCompare(b.author));
    }
}

class YearSortStrategy extends SortStrategy {
    sort(books) {
        return [...books].sort((a, b) => b.publishedYear - a.publishedYear);
    }
}

// Initialize library
const library = Library.getInstance();

// DOM Elements
const booksContainer = document.querySelector('.books-grid');
const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const closeModal = document.querySelector('.close');
const addBookForm = document.getElementById('addBookForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const sortSelect = document.getElementById('sortSelect');

// Event Listeners
addBookBtn.addEventListener('click', () => {
    addBookModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    addBookModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === addBookModal) {
        addBookModal.style.display = 'none';
    }
});

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBook = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value,
        isbn: document.getElementById('isbn').value.trim(),
        description: document.getElementById('description').value.trim(),
        publishedYear: parseInt(document.getElementById('publishedYear').value)
    };

    // Validate form
    if (!newBook.title || !newBook.author || !newBook.category || !newBook.isbn || !newBook.description || !newBook.publishedYear) {
        alert('Please fill in all fields');
        return;
    }

    // Add the book
    library.addBook(newBook);
    
    // Reset form and close modal
    addBookForm.reset();
    addBookModal.style.display = 'none';
    
    // Refresh display
    displayBooks();
    
    // Show success message
    alert('Book added successfully!');
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchBtn.addEventListener('click', performSearch);

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        const filteredBooks = library.searchBooks(query);
        displayBooks(filteredBooks);
    } else {
        displayBooks();
    }
}

categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const filteredBooks = library.filterBooks(category, status);
    displayBooks(filteredBooks);
});

statusFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const filteredBooks = library.filterBooks(category, status);
    displayBooks(filteredBooks);
});

sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    if (sortBy) {
        const sortedBooks = library.sortBooks(sortBy);
        displayBooks(sortedBooks);
    } else {
        displayBooks();
    }
});

// Optimize book card creation with debouncing
let displayTimeout;
function displayBooks(books = library.books) {
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        booksContainer.innerHTML = '';
        
        if (books.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results';
            noResultsMessage.innerHTML = `
                <i class="fas fa-book-open"></i>
                <h3>No Books Found</h3>
                <p>${getNoResultsMessage()}</p>
            `;
            booksContainer.appendChild(noResultsMessage);
            return;
        }

        const fragment = document.createDocumentFragment();
        books.forEach(book => {
            fragment.appendChild(createBookCard(book));
        });
        booksContainer.appendChild(fragment);
    }, 16); // One frame delay
}

// Helper function to get appropriate message based on filters
function getNoResultsMessage() {
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const searchQuery = searchInput.value.trim();

    if (searchQuery) {
        return `No books found matching "${searchQuery}"`;
    }
    if (category && status) {
        return `No ${status} books found in ${category} category`;
    }
    if (category) {
        return `No books found in ${category} category`;
    }
    if (status) {
        return `No ${status} books found`;
    }
    return 'No books available in the library';
}

// Functions
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card fade-in';
    card.style.animationDelay = `${Math.random() * 0.5}s`;
    
    // Generate a unique image URL based on the book title
    const imageUrl = `https://picsum.photos/seed/${book.title}/300/400`;
    
    const recommendations = library.getRecommendations(book.id);
    const recommendationsHtml = recommendations.length > 0
        ? `<div class="recommendations">
             <h4>You might also like:</h4>
             <ul>${recommendations.map(rec => `<li>${rec.title}</li>`).join('')}</ul>
           </div>`
        : '';

    card.innerHTML = `
        <div class="book-cover">
            <img src="${imageUrl}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-category">${book.category}</p>
                <p class="book-year">Published: ${book.publishedYear}</p>
                <div class="book-meta">
                    <span class="status-badge ${book.status}">${book.status}</span>
                </div>
                <div class="book-actions">
                    ${book.status === 'available' 
                        ? `<button class="action-btn borrow-btn" onclick="toggleBookStatus(${book.id})">Borrow</button>`
                        : `<button class="action-btn return-btn" onclick="toggleBookStatus(${book.id})">Return</button>`
                    }
                    <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        </div>
        ${recommendationsHtml}
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
    
    return card;
}

function filterBooks() {
    const category = categoryFilter.value;
    const availability = statusFilter.value;
    const filteredBooks = library.filterBooks(category, availability);
    displayBooks(filteredBooks);
}

function toggleBookStatus(id) {
    library.toggleBookStatus(id);
    displayBooks();
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        library.removeBook(id);
        displayBooks();
    }
}

// Helper function for category colors
function getCategoryColor(category) {
    const colors = {
        'Fiction': '#FF6B6B',
        'Science': '#4ECDC4',
        'History': '#45B7D1',
        'Non-Fiction': '#96CEB4'
    };
    return colors[category] || '#f5f5f5';
}

// Initial display
displayBooks();

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add category click handlers
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.querySelector('h3').textContent;
        categoryFilter.value = category;
        const filteredBooks = library.filterBooks(category, statusFilter.value);
        displayBooks(filteredBooks);
        
        // Scroll to books section
        document.getElementById('books').scrollIntoView({ behavior: 'smooth' });
    });
});

// Update the UI to use new features
function updateSearchSuggestions(input) {
    const suggestions = library.getSearchSuggestions(input);
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions
            .map(suggestion => `<div class="suggestion">${suggestion}</div>`)
            .join('');
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Add search suggestions event listener
searchInput.addEventListener('input', (e) => {
    updateSearchSuggestions(e.target.value);
}); 