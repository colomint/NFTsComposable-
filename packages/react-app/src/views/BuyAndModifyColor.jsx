import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";
import { useContractReader, usePoller } from "eth-hooks";
import { Address, Balance, Events } from "../components";
import { ethers } from "ethers";
import { useEthers, useEtherBalance, useContractFunction, useCall, useContractCall } from "@usedapp/core"
import ColorsModifiers from "../contracts/ColorModifiers.json";
export default function BuyAndModifyColor({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
    whitePaint,
    darkPaint,
    userTables,
    listOfTokensPerUser,
    colorTokenList,
    userSigner,
    ColorsModifiersContract,
    colorModifiersAddress

}) {
    const [newRColor, setNewRColor] = useState("")
    const [newGColor, setNewGColor] = useState("")
    const [newBColor, setNewBColor] = useState("")


    const ColorsModifiersABI = ColorsModifiers.abi;


    // const ColorsModifiersInterface = new utils.Interface(ColorsModifiersABI);




    console.log("darkPaint", parseInt(darkPaint._hex, 16));

    console.log(userTables);

    const darkPaint2 = useContractReader(readContracts, "ColorModifiers", "getBalance", [address, 1])
    console.log("darkPaint2", darkPaint2);

    const { state: mintTokensState, send: mintTokensSend } = useContractFunction(ColorsModifiersContract, "mint", userSigner)

    function useTotalSupply() {
        const { value, error } = useCall(colorModifiersAddress && {
            contract: ColorsModifiersContract,
            method: 'getBalanceWhitePaint',
            args: [address],
        }) ?? {}
        if (error) {
            console.error(error.message)
            return undefined
        }
        return value?.[0]
    }

    // function useTotalSupply() {
    //     const [tokenBalance] =
    //         useContractCall(
    //             address &&
    //             colorModifiersAddress && {
    //                 abi: ColorsModifiersInterface,
    //                 address: colorModifiersAddress,
    //                 method: 'getBalanceWhitePaint',
    //                 args: [address],
    //             }
    //         ) ?? []
    //     return tokenBalance
    // }

    console.log(address);
    const totalSupply = useTotalSupply()
    console.log("totalSupply", totalSupply);

    const etherBalance = useEtherBalance(address);

    console.log(etherBalance);


    // const balanceOfOwner = useContractFunction(ColorsModifiersContract, "getBalanceDarkPaint", address, userSigner)



    // console.log("balanceOfOwner", balanceOfOwner);



    const darkPaintInt = parseInt(darkPaint._hex, 16);
    const whitePaintInt = parseInt(whitePaint._hex, 16);

    let RGB = [];

    for (let i = 0; i < listOfTokensPerUser.length; i++) {
        RGB.push({
            id: parseInt(listOfTokensPerUser[i]?._hex),
            R: parseInt(colorTokenList[listOfTokensPerUser[i]]?.R?._hex),
            G: parseInt(colorTokenList[listOfTokensPerUser[i]]?.G?._hex),
            B: parseInt(colorTokenList[listOfTokensPerUser[i]]?.B?._hex)
        });
    }

    console.log(RGB);

    async function confirmTransaction() {

        let valueInEther = ethers.utils.parseEther("" + 0.00001);

        const result = await tx(writeContracts["ColorsNFT"].mint(
            newRColor,
            newGColor,
            newBColor,
            { value: valueInEther }
        ))

    }

    async function addWhitePaint(Id) {

        const byteNumber = "0x" + ("0".repeat(64) + Id).slice(-64) + "";

        const result = await tx(writeContracts["ColorModifiers"].safeTransferFrom(
            address, readContracts["ColorsNFT"].address, 1, 1, byteNumber

        ))

    }

    async function test() {
        return mintTokensSend();



    }
    async function addBlackPaint(Id) {

        const byteNumber = "0x" + ("0".repeat(64) + Id).slice(-64) + "";

        console.log(byteNumber)
        const result = await tx(writeContracts["ColorModifiers"].safeTransferFrom(
            address, readContracts["ColorsNFT"].address, 0, 1, byteNumber

        ))


    }

    async function getPaint() {

        const resultTx1 = await tx(writeContracts["ColorModifiers"].mint());

    }

    return (
        <>
            <div style={{ maxWidth: 100, margin: "auto", marginTop: 32, marginBottom: 32 }}>
                GET NFT COLOR
                <Divider />
                <div>
                    <Input
                        placeholder="Enter R"
                        value={newRColor}
                        onChange={(e) => { setNewRColor(e.target.value) }}
                    />
                </div>
                <div>
                    <Input
                        placeholder="Enter G"
                        value={newGColor}
                        onChange={(e) => { setNewGColor(e.target.value) }}
                    />
                </div>
                <div>
                    <Input
                        placeholder="Enter B"
                        value={newBColor}
                        onChange={(e) => { setNewBColor(e.target.value) }}
                    />
                </div>
                <Divider />

                <div>
                    <Button
                        onClick={confirmTransaction}
                        type="primary"
                    >
                        Confirm
                    </Button>
                </div>



            </div>
            <Divider />

            <div style={{ maxWidth: 400, margin: "auto", marginTop: 32, marginBottom: 32 }}>
                <h4> Your color NFTs</h4>
                <ul>
                    {RGB.map(userTable => (
                        <>
                            <li style={{ display: "flex", margin: "auto" }} key={userTable.id} >
                                <Button size="small"
                                    onClick={() => addWhitePaint(userTable.id)}
                                >
                                    White Paint
                                </Button>
                                &nbsp;
                                &nbsp;
                                <h6 style={{ color: `rgb(${userTable.R}, ${userTable.G},${userTable.B})` }}>
                                    {userTable.R} = {userTable.G} = {userTable.B}
                                </h6>
                                &nbsp;
                                &nbsp;
                                <Button size="small"
                                    onClick={() => addBlackPaint(userTable.id)}
                                >
                                    black paint
                                </Button>
                            </li>
                        </>

                    ))}

                </ul>

            </div>


            <Divider />

            <div>
                <h4>Your dark paints {darkPaintInt}</h4>

                <h4>Your white paints {whitePaintInt}</h4>
            </div>
            <Button size="small"
                onClick={() => test()}
            >
                test
            </Button>
            <h1>test {totalSupply}</h1>


        </>
    );
}
