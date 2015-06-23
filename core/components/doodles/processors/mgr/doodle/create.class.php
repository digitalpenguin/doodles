<?php
class DoodleCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'Doodle';
    public $languageTopics = array('doodles:default');
    public $objectType = 'doodles.doodle';

    public function beforeSave() {
        $name = $this->getProperty('name');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('doodles.doodle_err_ns_name'));
        } else if ($this->doesAlreadyExist(array('name' => $name))) {
            $this->addFieldError('name',$this->modx->lexicon('doodles.doodle_err_ae'));
        }

        $fileName = $this->getProperty('filename');
        if ($this->doesAlreadyExist(array('filename' => $fileName))) {
            $this->addFieldError('filename',$this->modx->lexicon('doodles.doodle_err_ae_image'));
        }

        return parent::beforeSave();
    }

    /** @var modMediaSource $source */
    public $source;
    /**
     * Get the active Source
     * @return modMediaSource|boolean
     */
    private function getSource() {
        $this->modx->loadClass('sources.modMediaSource');
        $this->source = modMediaSource::getDefaultSource($this->modx,$this->getProperty('source'));
        if (empty($this->source) || !$this->source->getWorkingContext()) {
            return false;
        }
        return $this->source;
    }

    public function process() {
        // Get the filename string from the $_FILES array
        $filenames = array();
        if (is_array($_FILES)) {
            foreach ($_FILES as $file) {
                if (!empty($file['name'])) {
                    $filenames[] = $file['name'];
                }
            }
        }
        // We only want one file so make sure we just take the first one.
        $fileName = $filenames[0];
        $this->setProperty('filename', $fileName);
        // Get filesystem source
        if (!$this->getSource()) {
            return $this->failure($this->modx->lexicon('permission_denied'));
        }
        $this->source->setRequestProperties($this->getProperties());
        $this->source->initialize();
        if (!$this->source->checkPolicy('create')) {
            return $this->failure($this->modx->lexicon('permission_denied'));
        }
        return parent::process();
    }

    public function afterSave() {
        $uploadUrl = $this->modx->getOption('doodles.upload_url',$this->modx->config,$this->modx->getOption('assets_url').'components/doodles/uploads/');
        $path = MODX_BASE_PATH . $uploadUrl . $this->getProperty('filename');
        $success = $this->source->uploadObjectsToContainer($uploadUrl,$_FILES);
        if (empty($success)) {
            $msg = '';
            $errors = $this->source->getErrors();
            foreach ($errors as $k => $msg) {
                $this->modx->error->addField($k,$msg);
            }
            return $this->failure($msg);
        }
        return parent::afterSave();
    }
}
return 'DoodleCreateProcessor';