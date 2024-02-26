import React, { useState } from 'react'
import { API } from "aws-amplify";
import Liveness from '../Components/Liveness'
import Form from "@awsui/components-react/form";
import SpaceBetween from "@awsui/components-react/space-between";
import { TextField } from '@aws-amplify/ui-react';
import { ImUser,ImCalendar, ImUserTie } from "react-icons/im";
import { Table, TableCell, TableRow } from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom"
import ErrorMessage from '../Error'
import { Navigate } from "react-router-dom";
import {
    // Image,
    Heading,
    FieldGroupIcon,
    useTheme,
    Button,
    Alert,
//    SliderField,
    Flex,
    View,
    Card,
    Text,
    Image as PreviewIDCard


} from '@aws-amplify/ui-react';
//import { JSONTree } from 'react-json-tree';




//User SignIn page
const RegisterWithIdCard = () => {
    const { tokens } = useTheme();
    // const canvasRef = useRef(null)
    const [id, setId] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [middleName, setMiddleName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [dob, setDOB] = useState(null)    
    const [cellphone, setcellphone] = useState(null)    
    const [email, setemail] = useState(null)    
    const [image, setImage] = useState({ 'imageName': '', 'imageFile': '', 'base64Image': '', width: '', height: '', refImage: '' })
    const [preview, setPreview] = useState()
    const [properties, setProperties] = useState({})
    const [livenessImageData, setLivenessImageData] = useState(null)
    const [livenessStart, setLivenessStart] = useState(false)
    const [step1, setStep1] = useState(true)
    const [step2, setStep2] = useState(false)
    const [error, setError] = useState({ 'idError': false, 'firstNameError': false, 'lastNameError': false, 'dobError': false })
    const [loading, setLoading] = useState(false)
    const [formSubmit, setFormSubmit] = useState(true)
    const [referenceImage, setreferenceImage] = useState(null)
    const [hasformError, setHasFormError] = React.useState('');
    const [sliderValue, setSliderValue] = useState(1);
    const [registerSuccess, setregisterSuccess] = useState();
    const [Report, setReport] = useState(false);
    const [jsonResponse, setJsonResponse] = useState(null)
    const navigate = useNavigate()
    const [formErrors, setFormErrors] = useState([]);
    const [Download,setDownload] = useState(false);
    let csvContent = "Item,UserId,First Name,Middle Name, Last Name,Date of Birth\n";
    
    const getReferenceImage = (image) => {
        setHasFormError('')
        if (!errorCheck() && image !== null && image.ReferenceImage) {
            setreferenceImage(image.ReferenceImage)
            setLivenessImageData(image)
            setJsonResponse(image)
            if (image.Confidence >= image.userSelectedConfidence) {
                setFormSubmit(false)
            } else if (image.error) {
                setHasFormError(ErrorMessage['GenericError'])
            }
        }
    }

    // const drawRectangleIDCard = (idImage) => {
    //     var imageWidth = image.width;
    //     var imageHeight = image.height;
    //     var left = imageWidth * idImage.DetectFace.FaceDetails[0].BoundingBox.Left
    //     var top = imageHeight * idImage.DetectFace.FaceDetails[0].BoundingBox.Top
    //     var width = imageWidth * idImage.DetectFace.FaceDetails[0].BoundingBox.Width
    //     var height = imageHeight * idImage.DetectFace.FaceDetails[0].BoundingBox.Height
   
    //     const context = canvasRef.current.getContext("2d");
    //     context.strokeStyle = "#75FF33";
    //     context.lineWidth = 1;
    //     context.strokeRect(left, top, width, height)
    // };

    function errorCheck() {
        var isError = false;
        const cellphoneRegex = /^\d+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (id === '' || id === null) {
            setError(error => ({ ...error, idError: true }))
            isError = true
        }
        if (firstName === '' || firstName === null) {
            setError(error => ({ ...error, firstNameError: true }))
            isError = true
        }
        if (lastName === '' || lastName === null) {
            setError(error => ({ ...error, lastNameError: true }))
            isError = true
        }
        if (dob === '' || dob === null) {
            setError(error => ({ ...error, dobError: true }))
            isError = true
        }
        if (cellphone === '' || cellphone === null || !cellphoneRegex.test(cellphone)) {
            setError(error => ({ ...error, cellphoneError: true }))
            isError = true
        }
        if (email === '' || email === null || !emailRegex.test(email)) {
            setError(error => ({ ...error, emailError: true }))
            isError = true
        }
        return isError;

    }

    function deleteUsers() {
        console.log('User deleted')
        const options = { headers: {
          'Content-Type': 'application/json'
        }}
        API.get("identityverification", "reset-user", options).then(response => {
            navigate("/");
         });
    }
    
    const handleDocumentUpload = (event) => {
        setHasFormError('')
        const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
       // Check if a file is uploaded
        if (event.target.files.length === 0) {
            // Handle the case where no file is selected
            return;
        }

        // Check if the file format is supported
        if (!supportedFormats.includes(event.target.files[0].type)) {
            // Handle the case where the file format is not supported
            setHasFormError("Unsupported file format. Please upload a JPEG, JPG, or PNG file.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = function () {
            var filedata = reader.result;
            var base64ImageId = filedata.replace(/^data:image\/[a-z]+;base64,/, "");
            const image = new Image();
            image.src = window.URL.createObjectURL(event.target.files[0]);
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                // var canvas = document.getElementById('refImage');
                // canvas.width = width
                // canvas.height = height
              
                setImage({
                    imageFile: event.target.files[0],
                    imageName: event.target.files[0].name,
                    base64Image: base64ImageId,
                    width: width,
                    height: height

                })
            }


            setProperties({})

        }

        reader.readAsDataURL(event.target.files[0]);


        if (event.target.files[0].name === '') {
            setPreview(undefined)

        }
        const objectUrl = URL.createObjectURL(event.target.files[0])
        setPreview(objectUrl)

    }

    const handleNextSubmit = () => {
        setError({ 'idError': false, 'firstNameError': false, 'lastNameError': false, 'dobError': false })
        if (!errorCheck()) {
            setHasFormError('')
            const requestData = {
                body: { "UserId": id }, // replace this with attributes you need
                headers: { "Content-Type": "application/json" }, // OPTIONAL
            };
            API.post("identityverification", "check-userid", requestData).then(response => {
                let responseData = response;
                console.log(responseData)
                setJsonResponse(responseData)
                if (responseData.Reason !== "User not Exist") {
                    deleteUsers()
                }
                setStep2(true)
                setStep1(false)
                setSliderValue(2)
/*                } else {
                    setHasFormError(ErrorMessage['UserAlreadyExists'])
                    setError(error => ({ ...error, idError: true }))
                }*/
            })
                .catch(error => {
                    console.log(error.response);
                    setHasFormError(ErrorMessage['GenericError'])
                });



        }
    }
    const handlePreviousSubmit = () => {
        setLivenessStart(false)
        setStep2(true)
        setSliderValue(2)
        setReport(false)
     // drawRectangleIDCard(properties)
    }

    const handleNextStep2Submit = () => {
        setLivenessStart(true)
        setStep2(false)
        setSliderValue(3)
    }

    const handleReCheck = () => {
        setLivenessStart(false)
        setLivenessImageData(null)
        setFormSubmit(true)
        setLivenessStart(true)
		setReport(false)
    }



    const handleConfirmToFetchImageData = () => {
        setHasFormError('')
        setLoading(true)
        const requestData = {
            body: { "UserId": id, "IdCard": image.base64Image, "ImageName": image.imageName }, // replace this with attributes you need
            headers: { "Content-Type": "application/json" }, // OPTIONAL
        };
        API.post("identityverification", "extract-idcard", requestData).then(response => {
            let responseData = response;
            setJsonResponse(responseData)
            setLoading(false)
            if (JSON.stringify(responseData.Properties) !== "{}") {
                setProperties(responseData)
                const newErrors = [];
                //drawRectangleIDCard(responseData)
                // Find the expiry date within the properties object
		        const expiryDate = new Date(responseData.Properties.EXPIRATION_DATE);
		        const currentDate = new Date();
		        const threeMonthsFromNow = new Date();
		        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

		        // Check if the expiry date is within 3 months from now
		        if (expiryDate.getTime() <= threeMonthsFromNow.getTime()) {
		            newErrors.push("ERROR: ID expired or about to expire in 3 months.");
		        }
		        // Check if the username matches with the ID number
		        if (id !== responseData.Properties.DOCUMENT_NUMBER) {
		            newErrors.push("ERROR: Identity Number and ID Number don't match.");
		        }
		        // Check if ID number is only numeric
		        const isNumeric = /^\d+$/.test(responseData.Properties.DOCUMENT_NUMBER);
		        const idDate = parseInt(responseData.Properties.DOCUMENT_NUMBER.substring(0, 2), 10)
		        const idMonth = parseInt(responseData.Properties.DOCUMENT_NUMBER.substring(2, 4), 10)
		        const idYear = parseInt(responseData.Properties.DOCUMENT_NUMBER.substring(4, 6), 10)
		        // Check if the DoB matches with ID
		        const input_DOB = new Date(dob);
		        const id_DOB = new Date(responseData.Properties.DATE_OF_BIRTH);
		        
		        if (input_DOB.getDate() !== id_DOB.getDate() || input_DOB.getMonth() !== id_DOB.getMonth() || input_DOB.getFullYear() !== id_DOB.getFullYear()) {
		            newErrors.push("ERROR: Date of Birth doesn't match as per ID.");
		        }
		        else if(isNumeric && (idDate !== id_DOB.getDate() || idMonth !== id_DOB.getMonth() || idYear !== id_DOB.getFullYear()%100))
		        {
			        newErrors.push("ERROR: Date of Birth doesn't match with ID.");
		        }
		        
		        // Check if the First Name matches with ID
		        if(responseData.Properties.FIRST_NAME.trim() === '') {
		            newErrors.push("ERROR: Upload proper image of ID.");
		        }
		        else if(firstName.toLowerCase() !== responseData.Properties.FIRST_NAME.toLowerCase()) {
		            newErrors.push("ERROR: First Name doesn't match with ID.");
		        }
		        
		        // Check if the Middle Name matches with ID if available
		        if(middleName !== null && middleName.trim() !== '' && responseData.Properties.MIDDLE_NAME.trim() === '') {
		            newErrors.push("ERROR: Middle Name was entered but not available in ID card.");
		        }
		        if(responseData.Properties.MIDDLE_NAME.trim() !== ''){
		            if(middleName === null || (middleName.trim().toLowerCase() !== responseData.Properties.MIDDLE_NAME.trim().toLowerCase())) {
		                newErrors.push("ERROR: Middle Name doesn't match with ID.");
		            }
		        }
		        
		        // Check if the Last Name matches with ID
		        if(responseData.Properties.LAST_NAME.trim() === '') {
		            newErrors.push("ERROR: Upload proper image of ID.");
		        }
		        else if(lastName.toLowerCase() !== responseData.Properties.LAST_NAME.toLowerCase()) {
		            newErrors.push("ERROR: Last Name doesn't match with ID.");
		        }
		        
		        // Set form errors with the array of error messages
		        if (newErrors.length > 0)
		        {
		            setHasFormError(newErrors);
		        }
            } 
            else {
                setHasFormError("We are unable to validate your document at this time. Please try again later.")
            }
        })
            .catch(error => {
                console.log(error);
                setLoading(false)
                setHasFormError("We are unable to validate your document at this time. Please try again later.")
            });
    }

    const handlePreviousStep1Submit = () => {
        setStep1(true)
        setStep2(false)
        setLivenessStart(false)
        setSliderValue(1)
    }

    const handleFormSubmit = () => {
        setSliderValue(4)
        setHasFormError('')
        setLoading(true)
        console.log(referenceImage)
        console.log(referenceImage.S3Object.Bucket)
        console.log(referenceImage.S3Object.Name)
        const requestData = {
            body: { "Properties": properties, "UserId": id, "IdCardName": id + '/' + image.imageName, "Bucket": referenceImage.S3Object.Bucket, "Name": referenceImage.S3Object.Name }, // replace this with attributes you need
            headers: { "Content-Type": "application/json" }, // OPTIONAL
        };
        API.post("identityverification", "register-idcard", requestData).then(response => {
            let responseData = response
            setJsonResponse(responseData)
            let responseReport = JSON.parse(responseData.input)
            setReport({ "properties": responseReport.inputRequest.Properties })
            if (responseData.status === "SUCCEEDED") {
                let responseSuccessData = JSON.parse(responseData.output)
                localStorage.removeItem("userSelectedConfidence")
                setregisterSuccess({ "userName": responseSuccessData.UserId, "imageId": responseSuccessData.ImageId, "label": "       Successfully Registered User", "properties": responseSuccessData.Properties, "responseData": responseData })

            } else {
                console.log(responseData.error)
                if (responseData.error === 'FaceNotMatchWithIDCard') {
                    console.log(responseData.error)
                    setHasFormError(ErrorMessage['FaceNotMatchWithIDCard'])
                } else if (responseData.error === 'UserAlreadyExists') {
                    setHasFormError(ErrorMessage['UserAlreadyExists'])
                } else {
                    setHasFormError(ErrorMessage['GenericError'])
                }
            }
            setLoading(false)
            //  setprogress(false)
        })
            .catch(error => {
                console.log(error);
                setLoading(false)
                setHasFormError(ErrorMessage['GenericError'])
            });


    }

    const handleDownload = () => {
        setDownload(true);
        
        // Create a CSV string
        
        csvContent += `User Input,${id},${firstName},${middleName},${lastName},${dob}\n`;
        csvContent += `From ID,${Report.properties.Properties.DOCUMENT_NUMBER},${Report.properties.Properties.FIRST_NAME},${Report.properties.Properties.MIDDLE_NAME},${Report.properties.Properties.LAST_NAME},${Report.properties.Properties.DATE_OF_BIRTH}\n`;
        csvContent += `Comparison,`
        if ( id === Report.properties.Properties.DOCUMENT_NUMBER)
            csvContent += `Pass,`
        else
            csvContent += `Fail,`
        if ( firstName.trim().toLowerCase() === Report.properties.Properties.FIRST_NAME.trim().toLowerCase())
            csvContent += `Pass,`
        else
            csvContent += `Fail,`
        if ( middleName !== null && middleName.trim().toLowerCase() === Report.properties.Properties.MIDDLE_NAME.trim().toLowerCase())
            csvContent += `Pass,`
        else if ( middleName !== null )
            csvContent += `Fail,`
        if ( lastName.trim().toLowerCase() === Report.properties.Properties.LAST_NAME.trim().toLowerCase())
            csvContent += `Pass,`
        else
            csvContent += `Fail,`
        const dobDate = new Date(dob);
        const regDate = new Date(Report.properties.Properties.DATE_OF_BIRTH);
        if ( dob && Report.properties.Properties.DATE_OF_BIRTH)
            if ( dobDate.getFullYear() === regDate.getFullYear() && dobDate.getMonth() === regDate.getMonth() && dobDate.getDate() === regDate.getDate() )
            csvContent += `Pass,`
            else
                csvContent += `Fail\n`
        else
            csvContent += `Fail\n`
        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user_details.csv');

        // Simulate a click event to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    };


    return (
        <>
            <View>
                <Heading
                    level={4}
                    color="black"
                    marginTop={tokens.space.small}
                    marginBottom={tokens.space.small}
                >
                    Onboarding user using Identity verification.
                </Heading>

                {hasformError !== '' &&
                    <>
                        <Alert
                            variation="error"
                            isDismissible={true}
                            hasIcon={true}
                            heading=""
                        >
                            {hasformError}
                        </Alert>
                    </>
                }

            </View>
            <Form
                direction={{ base: 'column', large: 'row' }}
                actions={
                    <SpaceBetween direction="horizontal" size="xs">

                        {livenessStart &&
                            <>
                                <Button variation="primary" onClick={handlePreviousSubmit}>Previous</Button>
                                {loading ? (
                                    <Button isLoading={true} loadingText="Submitting..." variation="primary">
                                    </Button>
                                ) : (
                                    <>
                                        {livenessImageData &&
                                            <Button variation="primary" type="submit" onClick={handleReCheck}>Re-Check</Button>}
                                        <Button variation="primary" type="submit" isDisabled={formSubmit} onClick={handleFormSubmit}>Submit</Button>

                                    </>)}
                            </>
                        }
                        {step1 &&
                            <>
                                <Button variation="primary" onClick={() => navigate(`/`)}>Cancel</Button>
                                <Button variation="primary" type="submit" onClick={handleNextSubmit}>Next</Button>
                            </>
                        }
                        {step2 &&
                            <>
                                <Button variation="primary" onClick={handlePreviousStep1Submit}>Previous</Button>
                                {preview &&
                                    <>
                                        {loading ? (
                                            <Button isLoading={true} loadingText="Fetching Data ..." variation="primary">
                                            </Button>
                                        ) : (
                                            <>
                                                {JSON.stringify(properties) === "{}" ? (
                                                    <Button variation="primary" type="submit" onClick={handleConfirmToFetchImageData}>Confirm</Button>
                                                ) : (<Button variation="primary" type="submit" onClick={handleNextStep2Submit}>Next</Button>
                                                )}
                                            </>

                                        )}


                                    </>
                                }
                            </>
                        }
                        {Report && 
                            <>
                                <Button variation="primary" type="submit" onClick={handleDownload}>Finish</Button>
                            </>
                        }

                    </SpaceBetween>
                }
            >
                {step1 &&
                    <>
                        <Card>
                            <Flex alignItems="center"
                                alignContent="center"
                                direction="column"
                                justifyContent="center"
                            >
                                <View
                                    maxWidth="100%"
                                    padding="1rem"
                                    width="50rem"
                                    as="div"
                                >
                                    <TextField
                                        label={
                                            <Text>
                                                Identity Number
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        onChange={e => { setId(e.target.value); setError(error => ({ ...error, idError: false })) }}
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        hasError={error.idError}
                                        errorMessage="Please enter Identity Number"
                                        value={id}
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="" >
                                                <ImUser />
                                            </FieldGroupIcon>
                                        }


                                    />
                                    <TextField
                                        onChange={e => { setFirstName(e.target.value); setError(error => ({ ...error, firstNameError: false })) }}
                                        label={
                                            <Text>
                                                First name
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={firstName}
                                        hasError={error.firstNameError}
                                        errorMessage="Please enter first name"
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImUserTie />
                                            </FieldGroupIcon>
                                        }


                                    />
                                    <TextField
                                        onChange={e => { setMiddleName(e.target.value) }}
                                        label={
                                            <Text>
                                                Middle name
                                            </Text>
                                        }
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={middleName}
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImUserTie />
                                            </FieldGroupIcon>
                                        }


                                    />
                                    <TextField
                                        onChange={e => { setLastName(e.target.value); setError(error => ({ ...error, lastNameError: false })) }}
                                        label={
                                            <Text>
                                                Last name
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={lastName}
                                        hasError={error.lastNameError}
                                        errorMessage="Please enter last name"
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImUserTie />
                                            </FieldGroupIcon>
                                        }


                                    />
                                    <TextField
                                        onChange={e => {
                                            const inputValue = e.target.value;
                                            // Check if the input value matches the YYYY-MM-DD format
                                            const regex = /^\d{4}-\d{2}-\d{2}$/;
                                            if (regex.test(inputValue)) {
                                                const year = inputValue.slice(0, 4); // Extract the year part
                                                if (year.length === 4) {
                                                    setDOB(inputValue); // Update the state if the year has 4 digits
                                                    setError(error => ({ ...error, dobError: false }));
                                                } else {
                                                    // Show error if the year doesn't have exactly 4 digits
                                                    setError(error => ({ ...error, dobError: true }));
                                                }
                                            } else {
                                                // Show error if the input format is incorrect
                                                setError(error => ({ ...error, dobError: true }));
                                            }
                                        }}
                                        label={
                                            <Text>
                                                Date of birth
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        type="date"
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={dob}
                                        hasError={error.dobError}
                                        errorMessage="Please enter date of birth (dd/mm/yyyy)"
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImCalendar />
                                            </FieldGroupIcon>
                                        }
                                    />
                                    <TextField
                                        onChange={e => { setcellphone(e.target.value); setError(error => ({ ...error, cellphoneError: false })) }}
                                        label={
                                            <Text>
                                                Cell Phone
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={cellphone}
                                        hasError={error.cellphoneError}
                                        errorMessage="Please enter valid Cell Phone number"
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImUserTie />
                                            </FieldGroupIcon>
                                        }


                                    />
                                    <TextField
                                        onChange={e => { setemail(e.target.value); setError(error => ({ ...error, emailError: false })) }}
                                        label={
                                            <Text>
                                                Email Address
                                                <Text as="span" fontSize="0.8rem" color="red">
                                                    {' '}
                                                    (required)
                                                </Text>
                                            </Text>
                                        }
                                        marginBottom={tokens.space.large}
                                        size="large"
                                        color="black"
                                        value={email}
                                        hasError={error.emailError}
                                        errorMessage="Please enter valid email address"
                                        innerStartComponent={
                                            <FieldGroupIcon ariaLabel="">
                                                <ImUserTie />
                                            </FieldGroupIcon>
                                        }


                                    />
                                </View></Flex></Card>
                    </>
                }

                {step2 &&
                    <>

                        <Card>
                            <Flex alignItems="center"
                                alignContent="center"
                                justifyContent="center"
                                direction={{ base: 'column', large: 'row' }}
                            >
                                <View
                                    // maxWidth="100%"
                                    padding="1rem"
                                    // width="50rem"
                                    as="p"
                                >
                                <Heading
                                    level={5}
                                    color="black"
                                    marginTop={tokens.space.small}
                                    marginBottom={tokens.space.small}
                                >
                                    Upload ID/Passport (JPEG / JPG / PNG)   
                                </Heading>
                                    <Button variation="primary">
                                        <input
                                            type="file"
                                            capture
                                            onChange={handleDocumentUpload}

                                        />
                                    </Button>
                                </View></Flex>
                            <Flex alignItems="center"
                                alignContent="center"
                                justifyContent="center"
                                direction={{ base: 'column', large: 'row' }}
                            >
                                <View
                                    // maxWidth="100%"
                                    padding="1rem"
                                    // width="50rem"
                                    as="p"
                                >

                                    {/* {preview &&
                                        <Alert
                                            variation="info"
                                            isDismissible={false}
                                            hasIcon={false}
                                            heading={image.imageName}
                                        >

                                        </Alert>
                                    } */}
                                    <View >
                                        <Flex  alignItems="center"
                                            alignContent="center"
                                            justifyContent="center" direction={{ base: 'column', large: 'row' }}>
                                            <Flex
                                                direction="column"
                                                alignItems="center"
                                                alignContent="center"
                                                justifyContent="center"
                                                gap={tokens.space.xs}
                                            >


                                                {JSON.stringify(properties) !== "{}" &&
                                                    <>
                                                        <Table variation="striped" color="black">
                                                            {
                                                                Object.keys(properties.Properties).map((key, i) => (
                                                                    <>
                                                                        {properties.Properties[key] !== '' &&
                                                                            <TableRow>
                                                                                <TableCell color="black">{key} </TableCell>
                                                                                <TableCell color="black">{properties.Properties[key]}</TableCell>
                                                                            </TableRow>
                                                                        }
                                                                    </>
                                                                ))
                                                            }
                                                        </Table>
                                                    </>
                                                }

                                            </Flex>
                                            {preview &&
                                                <>

                                                    {/* <canvas
                                                        id="refImage"
                                                        ref={canvasRef}
                                                        width= '100%'
                                                        height= 'auto'
                                                        max-width='100%'
                                                        style={{
                                                            //   width: "400px",
                                                            //   height: "400px",

                                                            alignItems: "center", alignContent: "center",
                                                            backgroundImage: 'url("' + preview + '")',
                                                            // backgroundSize: 'cover',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'center',
                                                            // height: image.height,
                                                            // width: image.width,
                                                            width: '100%',
                                                            height: 'auto',
                                                            // maxWidth:"400px",
                                                            overflow: 'hidden',
                                                            display: "block",
                                                            // position: 'relative'
                                                        }}
                                                    /> */}

                                                    <PreviewIDCard
                                                        alt="Trusted Source Document"
                                                        src={preview}
                                                        width="50%"
                                                        height="50%"
                                                        objectFit="cover"
                                                        objectPosition="50% 50%"
                                                    />



                                                </>
                                            }
                                        </Flex>
                                    </View>


                                </View></Flex></Card>



                    </>


                }

                {livenessStart &&

                    <Liveness referenceImage={getReferenceImage} livenessImageData={livenessImageData}></Liveness>


                }
                {registerSuccess && Download && < Navigate
                    to='/success'
                    state={registerSuccess
                    }
                >
                </Navigate >}
                {Report &&
                	(
						<Table variation="striped" color="black">
						    {/* Table rows */}
						    <TableRow>
						        <TableCell>User Name</TableCell>
						        <TableCell>{id}</TableCell>
						        <TableCell>{Report.properties.Properties.DOCUMENT_NUMBER}</TableCell>
						        <TableCell>{id === Report.properties.Properties.DOCUMENT_NUMBER ? 'Pass' : 'Fail'}</TableCell>
						    </TableRow>
						    <TableRow>
						        <TableCell>First Name</TableCell>
						        <TableCell>{firstName}</TableCell>
						        <TableCell>{Report.properties.Properties.FIRST_NAME}</TableCell>
						        <TableCell>{firstName.trim().toLowerCase() === Report.properties.Properties.FIRST_NAME.trim().toLowerCase() ? 'Pass' : 'Fail'}</TableCell>
						    </TableRow>
						    <TableRow>
						        <TableCell>Middle Name</TableCell>
						        <TableCell>{middleName}</TableCell>
						        <TableCell>{Report.properties.Properties.MIDDLE_NAME}</TableCell>
						        <TableCell>{middleName !== null && middleName.trim().toLowerCase() === Report.properties.Properties.MIDDLE_NAME.trim().toLowerCase() ? 'Pass' : 'Fail'}</TableCell>
						    </TableRow>
						    <TableRow>
						        <TableCell>Last Name</TableCell>
						        <TableCell>{lastName}</TableCell>
						        <TableCell>{Report.properties.Properties.LAST_NAME}</TableCell>
						        <TableCell>{lastName.trim().toLowerCase() === Report.properties.Properties.LAST_NAME.trim().toLowerCase() ? 'Pass' : 'Fail'}</TableCell>
						    </TableRow>
						    <TableRow>
						        <TableCell>Date of Birth</TableCell>
						        <TableCell>{dob}</TableCell>
						        <TableCell>{Report.properties.Properties.DATE_OF_BIRTH}</TableCell>
						        <TableCell>{dob && Report.properties.Properties.DATE_OF_BIRTH && (() => {
									const dobDate = new Date(dob);
									const regDate = new Date(Report.properties.Properties.DATE_OF_BIRTH);
									return (
									  dobDate.getFullYear() === regDate.getFullYear() &&
									  dobDate.getMonth() === regDate.getMonth() &&
									  dobDate.getDate() === regDate.getDate()
									) ? 'Pass' : 'Fail';
								  })()}
								</TableCell>
						    </TableRow>
						    <TableRow>
						        <TableCell>Image Check</TableCell>
						        <TableCell>Image from Liveness</TableCell>
						        <TableCell>Image from ID</TableCell>
						        <TableCell>{registerSuccess ? 'Pass' : 'Fail'}</TableCell>
						    </TableRow>
						</Table>
					)
                }

            </Form>

            
        </>
    );
}
export default RegisterWithIdCard;
