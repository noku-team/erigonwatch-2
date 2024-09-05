import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
	allocsProfileUrl,
	blockProfileUrl,
	goroutineProfileUrl,
	heapProfileUrl,
	mutexProfileUrl,
	threadCreateProfileUrl
} from "../../Network/APIHandler";

export interface ProfilePageProps {
	profile: string;
}

export const ProfilePage = ({ profile }: ProfilePageProps) => {
	const [imagesMap, setImagesMap] = useState<Map<string, string>>(new Map());
	const [loading, setLoading] = useState<boolean>(false);

	const getFunction = async () => {
		try {
			const resp = await axios.get(getFetchUrl(), {
				onDownloadProgress: (progressEvent) => {
					let eventObj: XMLHttpRequest | undefined = undefined;
					if (progressEvent.event?.currentTarget) {
						eventObj = progressEvent.event?.currentTarget;
					} else if (progressEvent.event?.srcElement) {
						eventObj = progressEvent.event?.srcElement;
					} else if (progressEvent.event?.target) {
						eventObj = progressEvent.event?.target;
					}
					if (!eventObj) return;
				}
			});
			setLoading(false);
			imagesMap.set(profile, resp.data);
		} catch (error) {
			setLoading(false);
			console.error(error);
		}
	};

	const getFetchUrl = () => {
		switch (profile) {
			case "heap":
				return heapProfileUrl();
			case "goroutine":
				return goroutineProfileUrl();
			case "threadcreate":
				return threadCreateProfileUrl();
			case "block":
				return blockProfileUrl();
			case "mutex":
				return mutexProfileUrl();
			case "allocs":
				return allocsProfileUrl();
			default:
				return heapProfileUrl();
		}
	};

	const capitalizeFirstLetter = (str: string): string => {
		if (str.length === 0) {
			return str;
		}
		return str[0].toUpperCase() + str.slice(1);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-row justify-between">
				<div className="w-[15%]">
					{loading ? (
						<CircularProgress />
					) : (
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setLoading(true);
								getFunction();
							}}
						>
							Fetch Data
						</Button>
					)}
				</div>
				<div className="w-[15%]">
					<h3 className="text-xl font-semibold">{capitalizeFirstLetter(profile) + " Profile"}</h3>
				</div>
				<div className="w-[15%]" />
			</div>
			<div className="mt-5 mr-5 mb-5">
				{imagesMap.get(profile) && (
					<TransformWrapper>
						<TransformComponent>
							<img
								src={`data:image/png;base64,${imagesMap.get(profile)}`}
								alt="test"
							/>
						</TransformComponent>
					</TransformWrapper>
				)}
			</div>
		</div>
	);
};
