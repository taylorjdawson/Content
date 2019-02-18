class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }
    reduceLayers(layer) {
        if (layer.length === 1) return layer[0];
        const newLayer = [];
        for (let i = 0; i < layer.length; i += 2) {
            let left = layer[i];
            let right = layer[i + 1];
            if (!right) {
                newLayer.push(left);
            }
            else {
                newLayer.push(this.concat(left, right));
            }
        }
        return this.reduceLayers(newLayer);
    }
    getRoot() {
        return this.reduceLayers(this.leaves);
    }
}

module.exports = MerkleTree;
