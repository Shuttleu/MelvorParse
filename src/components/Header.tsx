import { saveData } from "../type"

type CategoryProps = {
    save: saveData;
}

export default function Header (props: CategoryProps) {
    return (
        <>
            <p>Save Name: {props.save.header.saveName}</p>
            <p>Skill Level: {props.save.header.skillLevel.toLocaleString()}</p>
            <p>GP: {props.save.header.gp.toLocaleString()}</p>
            <p>Training: {props.save.header.activeTraining ? props.save.header.activeTrainingName.split(":")[1] : "Nothing"}</p>
            <p>Saved: {new Date(props.save.header.saveTime).toLocaleString()}</p>
        </>
    )
}