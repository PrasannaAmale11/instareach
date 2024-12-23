# Frontend Technical Interview Guide - React, JavaScript & DSA

## React Core Concepts

### 1. What is Virtual DOM and how does React use it?

**Answer**: Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize rendering through a process called reconciliation:

1. When state changes, React creates a new Virtual DOM tree
2. It compares this with the previous Virtual DOM tree (diffing)
3. Only the differences are updated in the real DOM
4. This process is more efficient than directly manipulating the DOM

### 2. Explain React Hooks and their rules

**Answer**: Hooks are functions that allow using state and lifecycle features in functional components.

Key Rules:
- Only call hooks at the top level
- Only call hooks from React functions
- Must be called in the same order every render

Common Hooks:
```javascript
// useState
const [count, setCount] = useState(0);

// useEffect
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// useCallback
const memoizedCallback = useCallback(
  () => {
    doSomething(count);
  },
  [count],
);

// useMemo
const memoizedValue = useMemo(
  () => computeExpensiveValue(count),
  [count]
);
```

### 3. Explain State Management in React

**Answer**: React offers multiple ways to manage state:

1. Local State (useState)
2. Context API for global state
3. Redux/MobX for complex applications

Example using Context:
```javascript
// Create context
const ThemeContext = React.createContext('light');

// Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Consumer
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

## JavaScript Questions

### 1. Explain Closures

**Answer**: A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

### 2. What is Event Delegation?

**Answer**: Event delegation is a technique where you attach an event listener to a parent element to handle events on its children, even those added dynamically.

```javascript
document.getElementById('parent').addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    console.log('Child element clicked');
  }
});
```

### 3. Explain Promise Chaining

**Answer**: Promise chaining allows you to execute asynchronous operations in sequence.

```javascript
fetchUserData(userId)
  .then(user => fetchUserPosts(user.id))
  .then(posts => fetchPostComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.error(error));
```

## Data Structures and Algorithms (DSA)

### 1. Two Sum Problem

**Question**: Find two numbers in an array that add up to a target sum.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  return [];
}

// Example
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

### 2. Binary Search Implementation

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// Example
console.log(binarySearch([1, 2, 3, 4, 5], 3)); // 2
```

### 3. Implement Debounce Function

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Example
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);
```

## Common Coding Challenges

### 1. Implement a Deep Clone Function

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const clone = Array.isArray(obj) ? [] : {};
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  
  return clone;
}
```

### 2. Flatten an Array

```javascript
function flattenArray(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

// Example
console.log(flattenArray([1, [2, 3], [4, [5, 6]]])); // [1, 2, 3, 4, 5, 6]
```

## Performance Optimization Questions

### 1. How would you optimize React performance?

**Answer**: Key techniques include:
- Using React.memo() for component memoization
- Implementing useCallback for function memoization
- Using useMemo for expensive calculations
- Code splitting with React.lazy and Suspense
- Virtual scrolling for long lists

Example:
```javascript
const MemoizedComponent = React.memo(function MyComponent(props) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
```

### 2. Explain Code Splitting in React

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

## Tips for the Interview

1. Think out loud while solving problems
2. Ask clarifying questions before implementing
3. Consider edge cases
4. Discuss time and space complexity
5. Suggest optimizations after providing initial solution
6. Be prepared to explain your previous project experiences
7. Know how to debug React applications

Remember to:
- Review React lifecycle methods
- Understand hooks thoroughly
- Practice implementing common data structures
- Be familiar with ES6+ features
- Know how to handle API calls and error states
- Understand state management patterns

  # React Hooks Interview Guide

## 1. useState Hook

**Question: Explain useState and its use cases**

```javascript
// Basic usage
const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};

// Object state
const UserForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: ''
  });

  // Correct way to update object state
  const updateName = (name) => {
    setUser(prevUser => ({
      ...prevUser,
      name
    }));
  };
};

// Array state
const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };
};
```

**Key Interview Questions:**
- What's the difference between class state and useState?
- Why use the functional update form (prevState => newState)?
- How to handle multiple related state variables?

## 2. useEffect Hook

**Question: Explain different use cases of useEffect**

```javascript
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  // Run on mount only
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Cleanup on unmount');
  }, []);

  // Run on dependency change
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUser();

    // Cleanup function
    return () => {
      // Cancel any subscriptions/requests
    };
  }, [userId]);

  // Run on every render
  useEffect(() => {
    document.title = `Profile of ${user?.name}`;
  });
};
```

**Key Interview Questions:**
- What are the different dependency array scenarios?
- How does cleanup work?
- How to handle race conditions in data fetching?

## 3. useCallback Hook

**Question: When and why should you use useCallback?**

```javascript
const SearchComponent = () => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((searchTerm) => {
    setQuery(searchTerm);
    // Expensive search operation
  }, []); // Empty deps array

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <Results query={query} />
    </div>
  );
};
```

**Key Interview Questions:**
- What's the performance benefit of useCallback?
- When should you avoid using useCallback?
- How does it work with React.memo?

## 4. useMemo Hook

**Question: Explain useMemo and its use cases**

```javascript
const ExpensiveComponent = ({ data, filter }) => {
  const expensiveCalculation = useMemo(() => {
    return data.filter(item => {
      console.log('Filtering...');
      return item.value > filter;
    });
  }, [data, filter]);

  return (
    <div>
      {expensiveCalculation.map(item => (
        <div key={item.id}>{item.value}</div>
      ))}
    </div>
  );
};
```

**Key Interview Questions:**
- What's the difference between useMemo and useCallback?
- When should you use useMemo?
- What are the performance implications?

## 5. useRef Hook

**Question: Explain the different use cases of useRef**

```javascript
const TextInput = () => {
  const inputRef = useRef(null);
  const renderCount = useRef(0);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Track renders without causing re-render
    renderCount.current += 1;
    console.log(`Rendered ${renderCount.current} times`);
  });

  return <input ref={inputRef} />;
};
```

**Key Interview Questions:**
- How is useRef different from useState?
- What are common use cases for useRef?
- Why use useRef for render counts?

## 6. Custom Hooks

**Question: Create a custom hook for form handling**

```javascript
const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit
  };
};

// Usage
const LoginForm = () => {
  const { values, handleChange, handleSubmit } = useForm({
    email: '',
    password: ''
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

**Key Interview Questions:**
- What are the benefits of custom hooks?
- How to share logic between components?
- What naming conventions should be followed?

## 7. useReducer Hook

**Question: When would you use useReducer over useState?**

```javascript
const initialState = {
  count: 0,
  error: null,
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'setError':
      return { ...state, error: action.payload };
    case 'setLoading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
};
```

**Key Interview Questions:**
- When is useReducer preferred over useState?
- How to handle complex state logic?
- What are the benefits of using reducers?

## Common Hook Mistakes to Avoid

1. **Infinite Loops**
```javascript
// Bad
useEffect(() => {
  setCount(count + 1);
}); // Missing dependency array

// Good
useEffect(() => {
  setCount(c => c + 1);
}, []); // Run once on mount
```

2. **Stale Closures**
```javascript
// Bad
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(interval);
}, []); // count is stale

// Good
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(interval);
}, []); // Using functional update
```

3. **Unnecessary Dependencies**
```javascript
// Bad
const handleClick = useCallback(() => {
  console.log(props.value);
}, [props]); // Entire props object as dependency

// Good
const handleClick = useCallback(() => {
  console.log(props.value);
}, [props.value]); // Only the needed value
```

## Performance Optimization with Hooks

1. **Memoizing Expensive Calculations**
```javascript
const MemoizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

2. **Optimizing Callbacks**
```javascript
const OptimizedList = ({ items }) => {
  const handleItemClick = useCallback((id) => {
    console.log(`Item ${id} clicked`);
  }, []); // Stable callback reference

  return items.map(item => (
    <Item
      key={item.id}
      onClick={handleItemClick}
    />
  ));
};
```
# React Developer Interview Guide

## Core React Concepts

### 1. Question: Explain Virtual DOM and its benefits
**Answer**: 
The Virtual DOM is a lightweight copy of the actual DOM. When state changes in a React component:
1. React creates a new Virtual DOM tree
2. Compares it with the previous Virtual DOM (diffing)
3. Calculates minimal number of updates needed
4. Updates only the changed elements in the real DOM

```javascript
// Example of how React updates efficiently
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
// Only the count text will be updated, not the entire div or button
```

### 2. Question: What are controlled vs uncontrolled components?
**Answer**: 
- Controlled components: Form elements whose values are controlled by React state
- Uncontrolled components: Form elements that maintain their own internal state

```javascript
// Controlled Component
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled Component
function UncontrolledInput() {
  const inputRef = useRef(null);
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```

### 3. Question: Explain React's Component Lifecycle using Hooks
**Answer**:
```javascript
function LifecycleComponent() {
  // Constructor equivalent
  const [data, setData] = useState(null);

  // ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => cleanup(); // ComponentWillUnmount
  }, []);

  // ComponentDidUpdate
  useEffect(() => {
    if (data) {
      console.log('Data updated:', data);
    }
  }, [data]);

  return <div>{/* render content */}</div>;
}
```

## State Management

### 4. Question: How do you manage global state in React?
**Answer**: There are several approaches:

1. Context API for simpler applications:
```javascript
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

2. Redux for complex applications:
```javascript
// reducer.js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
};

// Component
function Counter() {
  const count = useSelector(state => state.counter);
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      Count: {count}
    </button>
  );
}
```

### 5. Question: How do you optimize React performance?
**Answer**:

```javascript
// 1. Use React.memo for component memoization
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});

// 2. Use useCallback for function memoization
function SearchComponent() {
  const [query, setQuery] = useState('');
  
  const handleSearch = useCallback((searchTerm) => {
    setQuery(searchTerm);
  }, []); // Empty deps array as it doesn't depend on any values
  
  return <SearchInput onSearch={handleSearch} />;
}

// 3. Use useMemo for expensive calculations
function DataGrid({ data, filter }) {
  const filteredData = useMemo(() => {
    return data.filter(item => item.value > filter);
  }, [data, filter]);
  
  return <div>{/* render filtered data */}</div>;
}
```

## Error Handling

### 6. Question: How do you handle errors in React?
**Answer**:

```javascript
// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Testing

### 7. Question: How do you test React components?
**Answer**:

```javascript
// Component to test
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

// Test file
import { render, fireEvent } from '@testing-library/react';

test('counter increments when clicked', () => {
  const { getByText, getByTestId } = render(<Counter />);
  const button = getByText('Increment');
  
  fireEvent.click(button);
  
  expect(getByTestId('count')).toHaveTextContent('1');
});
```

## Advanced Patterns

### 8. Question: Explain Render Props pattern
**Answer**:

```javascript
// Mouse tracker component using render props
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };
  
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };
  
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <h1>Mouse position: {x}, {y}</h1>
  )}
/>
```

### 9. Question: How do you implement code splitting in React?
**Answer**:

```javascript
// Using React.lazy and Suspense
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <OtherComponent />
    </Suspense>
  );
}

// Route-based code splitting
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home = React.lazy(() => import('./routes/Home'));
const About = React.lazy(() => import('./routes/About'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 10. Question: How do you handle API calls in React?
**Answer**:

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Practical Coding Challenges

### Challenge 1: Implement a debounced search input
**Task**: Create a search input that only triggers the search after the user stops typing for 300ms.

```javascript
function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Searching for: {debouncedQuery}</p>
    </div>
  );
}
```
