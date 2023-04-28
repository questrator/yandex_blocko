function layout(blocks) {
    const ids = [];
    const blocksMap = {};
    
    function getRotatedBlock(block) {
        return {
            id: block.id + "R",
            form: block.form.reduceRight((r, e) => [...r, [...e].reverse()], [])
        };
    }

    function permutate(array, k) {
        const permutations = [];
        const permutation = new Array(k);
        const internalPermutate = (elements, depth) => {
            if (depth === k) {
                permutations.push([...permutation]);
                return;
            }
            elements.forEach((element, index) => {
                permutation[depth] = element;
                const partial = [...elements.slice(0, index), ...elements.slice(index + 1)];
                internalPermutate(partial, depth + 1);
            })
        }
        internalPermutate(array, 0);
        return permutations;
    }

    const canBeStart = (id) => blocksMap[id][0].every(e => e === 1);
    const canBeEnd = (id) => blocksMap[id][blocksMap[id].length - 1].every(e => e === 1);
    const sumLines = (a, b) => a.reduce((r, e, i) => [...r, e + b[i]], []);

    function areFitted(upperId, lowerId) {
        let upperDepth = 0;
        let lowerDepth = 0;
        for (let i = blocksMap[upperId].length - 1; i >= 0; i--) {
            if (blocksMap[upperId][i].every(e => e === 1)) break;
            else upperDepth++;
        }
        for (let i = 0; i < blocksMap[lowerId].length; i++) {
            if (blocksMap[lowerId][i].every(e => e === 1)) break;
            else lowerDepth++;
        }
        if (upperDepth === lowerDepth) {
            if (upperDepth === 0) return true;
            for (let i = 0; i < upperDepth; i++) {
                const lowerLine = blocksMap[lowerId][i];
                const upperLine = blocksMap[upperId][blocksMap[upperId].length - upperDepth + i];
                if (!sumLines(lowerLine, upperLine).every(e => e === 1)) return false;
            }
            return true;
        }
        else return false;
    }

    blocks.forEach(e => {
        blocksMap[e.id] = e.form;
        blocksMap[e.id + "R"] = getRotatedBlock(e).form;
        ids.push(e.id, e.id + "R");
    });

    const combinations = permutate(ids, ids.length / 2);    

    const filteredCombinations = [];
    for (let set of combinations) {
        if (filteredCombinations.length === 1) break;
        if (canBeStart(set[0]) && canBeEnd(set[set.length - 1])) {
            for (let i = 1; i < set.length; i++) {
                if (!areFitted(set[i - 1], set[i])) break;
                if (i === set.length - 1) {
                    const deduplicatedSet = new Set(set.map(e => `${e}`.replace("R", "")));
                    if (deduplicatedSet.size === set.length) filteredCombinations.push(set);
                };                
            }
        }
    }

    return filteredCombinations[0].map((e, i) => {
        return {
            blockId: parseInt(e),
            position: i + 1,
            isRotated: `${e}`.endsWith("R")
        };
    });
}
