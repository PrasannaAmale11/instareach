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
