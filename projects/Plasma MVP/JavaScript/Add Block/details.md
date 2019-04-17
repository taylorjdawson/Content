## Counter Timeline

Let's take a look at how our two counters `nextTxBlock` and `nextDepositBlock` change over time. 

![Counter Timeline](https://res.cloudinary.com/divzjiip8/image/upload/v1555509984/DepositCounter_ifsqhi.png)

It's important to recognize that our counter is set to be the **next** value. So while `nextTXBlock` may be ahead by our buffer (`1000`), the deposit blocks will still be incrementing by `1`. 

Once a plasma block is submitted, we'll move our deposit block counter forward by our block buffer and add one so we're pointing at the next block number. 