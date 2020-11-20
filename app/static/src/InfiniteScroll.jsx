import agent from './agent';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

export default function InfiniteScroll() {

    const [data, setData] = useState({body: []});
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setIsFetching(true);
    }

    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchData();
    }, [isFetching]);


    async function fetchData() {
        const result = await agent.Images.get(page);
        if (!!result.body && !!result.body.length) {
            setData({body: [...data.body, ...result.body]});
            setPage(page + 1);
            setIsFetching(false);
        }
    }

    function Loading() {
        return(
            <div style={{top: '46%', left: '43%', position: 'absolute'}}>
                <ReactLoading type={"cubes"} color={"#dc004e"}/>
            </div>
        )
    }

    return (
        <div>
            {
                !!data.body.length ? data.body.map((image, index) => (
                        <img src={image} key={index} style={{maxWidth: '50%', maxHeight: '400px'}} alt="none"/>
                    ))
                    :
                <Loading/>
            }
            { !!isFetching &&
                <Loading/>}
        </div>
    )

}