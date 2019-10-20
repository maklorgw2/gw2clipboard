import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { CategoryTree } from "@components/CategoryTree";
import { Config } from "@components/Config";

export const BaseRouter = () => {
	return (<Switch>
		<Route path="/CategoryType/:categoryType">
			<Layout>
				<CategoryTree />
			</Layout>
		</Route>
		<Route path="/Config">
			<Layout>
				<Config />
			</Layout>
		</Route>
		<Route path="/">
			<Layout />
		</Route>
	</Switch>);
};
