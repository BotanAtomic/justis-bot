import {BsCheckLg, BsFillMicFill, BsMicMuteFill} from "react-icons/bs";
import {useEffect, useState} from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {GrUser, GrUserPolice} from "react-icons/gr";
import {languages} from "./languages";
import TextareaAutosize from 'react-textarea-autosize';

const PoliceBubble = ({value}) => {
    return (
        <div className={"relative w-full px-4 lg:w-2/3 flex items-center justify-center space-x-4"}>
            <GrUserPolice size={22}/>
            <span className={"w-full pl-12 h-auto flex items-center pr-8 py-2 outline-none rounded-3xl border-2 content-none overflow-hidden"}>
                {value}
            </span>
        </div>
    )
}

const UserBubble = ({defaultValue = "",callback, isLast, listening, start, stop, transcript}) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if(isLast) {
            setValue(transcript)
        }
    }, [isLast, transcript])

    return (
        <div className={"relative px-4 w-full lg:w-2/3 flex items-center justify-center space-x-4"}>
            {defaultValue &&
            <span className={"w-full pl-12 h-auto flex items-center pr-8 outline-none rounded-3xl border-2 content-none overflow-hidden"}>
                {defaultValue}
            </span>}
            {!defaultValue && <TextareaAutosize cacheMeasurements={true}  className={"resize-none w-full py-2 pl-4 lg:pr-16 pr-16 outline-none rounded-3xl border-2 content-none overflow-hidden"}
                      value={value} onChange={(e) => isLast && setValue(e.target.value)}/>}
            <GrUser size={22}/>

            {listening && isLast && <BsFillMicFill className={"absolute right-24 lg:right-22 top-1/2 transform -translate-y-1/2 text-green-900"}
                                        onClick={stop} size={22}/>}
            {!listening && isLast &&  <BsMicMuteFill className={"absolute right-24 lg:right-22 top-1/2 transform -translate-y-1/2 text-red-900"}
                                         onClick={start} size={22}/>}
            {value && isLast && <BsCheckLg className={"absolute right-16 lg:right-16 top-1/2 transform -translate-y-1/2 text-green-900"}
                                           size={22} onClick={callback}/> }
        </div>
    )
}

var questions = [
    "Bonjour, je vais vous aider dans votre démarche. Dans quelle ville souhaitez vous déposer votre plainte? Servez-vous des commandes ci-dessous pour interagir...",
    "Déposez-vous votre plainte en tant que victime, représentant légal d'une personne morale ou bien représentant légal d'une personne physique?",
    "Pouvez-vous me donner vos noms et prénoms ?",
    "Quels sont les faits dont vous avez été victime ? Une atteinte aux biens ou bien des faits discriminatoires?",
    "Pouvez-vous décrire les faits?",
    "Merci. Votre plainte a été enregistrée. Nous revenons vers vous dans les plus brefs délais."
];

function App() {

    const [lang, setLang] = useState('fr-FR')
    const [step, setStep] = useState(1);

    const {
        transcript,
        listening,
        resetTranscript,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    useEffect(() => {
        if(!isMicrophoneAvailable) {
            alert("You must enable microphone permission")
        }
    }, [isMicrophoneAvailable])

    return (
        <div className={"flex flex-col w-full h-full overflow-y-auto relative"}>

            <div className={"absolute top-0 right-0"}>
                <select name={"languages"} value={lang} onChange={(e) => setLang(e.target.value)}>
                    {languages.map((l) => (
                        <option value={l[1][0]}>{l[0]}</option>
                    ))}
                </select>
            </div>

            <div className={"flex flex-col items-center justify-center w-full"}>
                <img src={"logo.png"}  alt={"ok"}/>
                <span className={"text-2xl text-gray-700 font-bold"}>J.U.S.T.I.S</span>

                <span className={"text-2xl text-gray-600 font-bold pt-4"}>Assistance Plainte</span>
                <span className={"text-xl lg:px-0 lg:w-1/4 md:w-48 md:px-4 text-center text-gray-600 font-semibold pb-8"}>
                    Dans tous les cas d'urgence, appelez immédiatement par téléphone le <b>17</b> ou le <b>112</b>
                </span>


                <div className={"w-full flex flex-col items-center justify-center space-y-4"}>
                    {Array(step).fill(0).map((a, i) => (
                        <>
                            <PoliceBubble value={questions[i]}/>
                            {i < questions.length - 1 && <UserBubble
                                callback={() => {
                                    resetTranscript()
                                    setStep((a) => Math.min(a + 1, questions.length));
                                }}
                                start={() => SpeechRecognition.startListening({continuous: false, language: lang})}
                                stop={SpeechRecognition.stopListening}
                                listening={listening}
                                isLast={i === step - 1}
                                transcript={transcript}
                            />}
                        </>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default App;
