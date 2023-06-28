import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { getConfigSlice } from "../../redux/reducers/getConfigSlice";
import { useAppDispatch } from "../../hooks/redux/redux";

// import { Entries } from "type-fest";
import {
	DynamicObjectKeysI,
	// MainInfoOfRequestFromFieldsI,
	// InfoOfParamsFromFieldsI,
	RequestHistoryItemI
} from "../../types/simple_models";

import CustomButton from "../UI/Buttons/PrimaryButton";
import LinkButton from "../UI/Buttons/RedirectButton";
import FormWithTwoFields from "../FormWithTwoFields";
import Switch from "../UI/Switch/Switch";
import ParamsList from "../ParamsList";

import classes from "./GetForm.module.scss";
import { idb_set } from "../../tools/idb-tools/idbMethods";
import { request_history_db } from "../../hooks/idb/request-history-db";

function GetForm(): JSX.Element {
	const [parameters, setParameters] = useState<DynamicObjectKeysI>({});
	const [displayedParameters, setDisplayedParameters] = useState<[string, string | number][]>([]);
	const [needParameters, setNeedParameters] = useState<boolean>(false);
	const [needRedirect, setNeedRedirect] = useState<boolean>(false);
	const displayedParameterNameRef = useRef<HTMLInputElement>(null);
	const displayedParameterValueRef = useRef<HTMLInputElement>(null);

	const { updateConfig } = getConfigSlice.actions;
	const dispatch = useAppDispatch();

	const handleSubmitParams = (values: DynamicObjectKeysI): void => {
		parameters[values.parameter_name] = values.parameter_value;

		const parametersMatrix = Object.entries(parameters);
		setDisplayedParameters(parametersMatrix);
	};

	const handleSubmitFetch = (values: DynamicObjectKeysI): void => {
		if (!values.request_name && values.request_url) return console.error("не все поля заполнены");

		const request_id: number = new Date().getTime();
		const request_date: string = new Date().toLocaleString("en-GB", {
			timeZone: "UTC"
		});

		const request_time: string = new Date().toLocaleTimeString("en-GB");
		const requestHistoryItem: RequestHistoryItemI = {
			date: request_date,
			time: request_time,
			name: String(values.request_name),
			url: String(values.request_url),
			parameters: parameters ? parameters : {}
		};

		idb_set(request_id, requestHistoryItem, request_history_db, "history");
		dispatch(
			updateConfig({
				url: String(values.request_url),
				params: parameters,
				request_name: String(values.request_name)
			})
		);
		setNeedRedirect(true);
	};

	return (
		<div className={classes.PageWrapper}>
			<div className={classes.SettingsWrapper}>
				<FormWithTwoFields
					firstInitValueName={"request_url"}
					secondInitValueName={"request_name"}
					firstInitValue={"https://jsonplaceholder.typicode.com/posts"}
					secondInitValue={"asd"}
					firstInfoText={"Fetch url:"}
					secondInfoText={"File name:"}
					onSubmitFuncton={handleSubmitFetch}
					formId={"main-request-data"}
				/>
				<div className={classes.ButtonsWrapper}>
					<Switch
						needParameters={needParameters}
						spanText={"Need parameters?"}
						handleIsCheckedParameters={() => {
							setNeedParameters(!needParameters);
						}}
					/>
				</div>
				<div className={`${classes.ParametersWrapper} ${needParameters ? classes.active : ""}`}>
					<FormWithTwoFields
						firstInitValueName={"parameter_name"}
						secondInitValueName={"parameter_value"}
						firstInitValue={"_limit"}
						secondInitValue={1}
						firstInfoText={"Parameter name:"}
						secondInfoText={"Parameter value:"}
						firstRef={displayedParameterNameRef}
						secondRef={displayedParameterValueRef}
						onSubmitFuncton={handleSubmitParams}
						formId={"parameters-data"}
					/>
					<div className={classes.ParametersAddButton}>
						<CustomButton
							type={"submit"}
							form={"parameters-data"}
						>
							Add parameter
						</CustomButton>
					</div>
					<div className={classes.ParametersList}>
						<ParamsList
							displayedParameters={displayedParameters}
							setDisplayedParameters={setDisplayedParameters}
							parameters={parameters}
							setParameters={setParameters}
						/>
					</div>
				</div>
				<div>
					<CustomButton
						type={"submit"}
						form={"main-request-data"}
					>
						Submit
					</CustomButton>
					<LinkButton
						content={"Go home"}
						path={"/welcome"}
					/>
				</div>
				{needRedirect ? <Navigate to="/workspace" /> : <></>}
			</div>
		</div>
	);
}

export default GetForm;
