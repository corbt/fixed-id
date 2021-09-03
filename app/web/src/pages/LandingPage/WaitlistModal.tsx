import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseDisclosureReturn,
} from '@chakra-ui/react'

export default (props: { controls: UseDisclosureReturn }) => (
  <Modal
    isOpen={props.controls.isOpen}
    onClose={props.controls.onClose}
    size="xl"
  >
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalBody p="0">
        <iframe
          title="Waitlist"
          height="600"
          src="https://a356ee33.sibforms.com/serve/MUIEAMg8sg0XiJ_otAz3xD376uL4V-qd_YC1uz_599R9U4K2FI1U9nMF0DOWlo7AqFXXAZ9h7MgYfUMO3NcRPY4xxAzyA-WcH2FEQKpceCacus_8_pP7v4jgVTk1Esn8Yh4vnxqW0krd5rs_JPfQfE1RQkJfAFzHBs0LWWgXbwgwrJRDzQtkoLu4ckVBAWHV_PbNGEJwjmONh484"
          frameBorder="0"
          scrolling="auto"
          allowFullScreen
          style={{
            display: 'block',
            width: '100%',
          }}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
)
