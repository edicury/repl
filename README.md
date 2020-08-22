# repl

## What is it ?
Simple `repl` for `lisp` expressions done in `node.js`.
Will improve to support full programming language features in the future.


## How to use it ? 

```npm run repl```

```sh
repl> (+ 1 2)
3
```

```sh
repl> (+ 1 (- 10 (* 1 (/ 6 2))))
8
```

```sh
repl> (* 10.5 2)
21
```

```sh
repl> (+ 5 -2)
3
```

```sh
repl> (= 1 0)
true
```

```sh
repl> (= "hello" "hello")
true
```

```sh
repl> tree
tree> (+ 1 2)
{
  "method": "+",
  "literals": [
    {
      "type": "number",
      "value": 1
    },
    {
      "type": "number",
      "value": 2
    }
  ],
  "children": []
}
tree> exit
repl> (+ 1 2)
3
```

## How to run tests ?
```npm test```