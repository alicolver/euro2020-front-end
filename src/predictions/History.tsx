import { Container, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import BottomNav from "../misc/BottomNav";
import Header from "../misc/Header";
import HeaderReturn from "../misc/HeaderReturn";
import { resolveEndpoint, getJWT, isAdminCheck, getUserid } from "../utils/Utils";
import FixedGame from "./FixedGame";
import { IMatch } from "./Predictions";

const useStyles = makeStyles({
    upcomingGames: {
        fontSize: '8vw',
        marginTop: '19vw',
        fontFamily: [
            'Source Sans Pro',
            'sans-serif',
        ].join(','),
        paddingBottom: '3vw'
    },
    historyContainer: {
        marginBottom: '19vw',
        textAlign: 'center'
    }
})

interface IParams {
    userid?: string
}

export default function History() {
    const classes = useStyles()
    const [name, setName] = useState<string>("Your")
    const [matches, setMatches] = useState<IMatch[]>([])
    const [inProgressMatches, setInProgressMatches] = useState<IMatch[]>([])
    const [invalidResponse, setInvalidResponse] = useState<boolean>(false)

    const params = useParams<IParams>()

    useEffect(() => {
        if (params.userid) {
            getMatches(parseInt(params.userid));
            getName(parseInt(params.userid))
        } else {
            console.log(getUserid())
            getMatches(getUserid())
        }
    }, [params.userid])

    if (invalidResponse) {
        return (
            <Redirect to={'/'} />
        )
    } else {
        return (
            <>
                {!params.userid ? <Header /> : <HeaderReturn />}
                <Container className={classes.historyContainer}>
                    <Typography className={classes.upcomingGames}>{name} Predictions</Typography>
                    {inProgressMatches.map(element => { return (<FixedGame {...element} in_progress={true}/>) })}
                    {matches.map(element => { return (<FixedGame {...element} />) })}
                </Container>
                {!params.userid ? <BottomNav value={'/history'} admin={isAdminCheck()} /> : <></>}
            </>
        )
    }

    function getMatches(userid: number) {
        fetch(resolveEndpoint('match/ended?userid=' + userid), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setMatches(res.matches)
            } else {
                setInvalidResponse(true);
            }
        });
        fetch(resolveEndpoint('match/in-progress?userid=' + userid), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setInProgressMatches(res.matches)
            } else {
                setInvalidResponse(true);
            }
        });
    }

    function getName(userid: number) {
        fetch(resolveEndpoint('user/name?userid=' + userid), {
            method: 'GET',
            headers: {
                'Authenticate': getJWT()
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setName(res.name.split(" ")[0] + "'s")
            } else {
                setInvalidResponse(true);
            }
        });
    }
}