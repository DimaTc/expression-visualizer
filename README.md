# expression-visualizer

A visualizer that will break down logic expressions into a tree view

[Link to the project](https://dimatc.github.io/expression-visualizer)

## about

The visualizer parses a logic expression with proper rules and translate it to a tree graph.
The graph represents the sub expressions that builds the given expression.

## how to use

You can try any expression that you want as long as it follows this rules:

- an expression should contain proper words and actions
- p<sub>(i)</sub> should be a proper word (one or more letters)
- there is only those two actions:

  - ~(&alpha;)
  - (&alpha;)&loz;(&beta;)

  &loz; &isin; all special chars and len(&loz;) = 1

### Example

the expression:
`(~((a)*(ba)))*(((c)*(~(e)))&(d))`
will break down to:
![Tree Graph](/img/tree.jpg)
