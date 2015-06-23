<?php
class Doodles {
    public $modx;
    public $config = array();
    function __construct(modX &$modx,array $config = array()) {
        $this->modx =& $modx;

        $basePath = $this->modx->getOption('doodles.core_path',$config,$this->modx->getOption('core_path').'components/doodles/');
        $assetsUrl = $this->modx->getOption('doodles.assets_url',$config,$this->modx->getOption('assets_url').'components/doodles/');
        $uploadUrl = $this->modx->getOption('doodles.upload_url',$config,$this->modx->getOption('assets_url').'components/doodles/uploads/');
        $this->config = array_merge(array(
            'basePath' => $basePath,
            'corePath' => $basePath,
            'modelPath' => $basePath.'model/',
            'processorsPath' => $basePath.'processors/',
            'templatesPath' => $basePath.'templates/',
            'chunksPath' => $basePath.'elements/chunks/',
            'jsUrl' => $assetsUrl.'js/',
            'cssUrl' => $assetsUrl.'css/',
            'assetsUrl' => $assetsUrl,
            'uploadUrl' => $uploadUrl,
            'connectorUrl' => $assetsUrl.'connector.php',
        ),$config);
        $this->modx->addPackage('doodles',$this->config['modelPath']);
    }

    public function getChunk($name,$properties = array()) {
        $chunk = null;
        if (!isset($this->chunks[$name])) {
            $chunk = $this->modx->getObject('modChunk',array('name' => $name));
            if (empty($chunk) || !is_object($chunk)) {
                $chunk = $this->_getTplChunk($name);
                if ($chunk == false) return false;
            }
            $this->chunks[$name] = $chunk->getContent();
        } else {
            $o = $this->chunks[$name];
            $chunk = $this->modx->newObject('modChunk');
            $chunk->setContent($o);
        }
        $chunk->setCacheable(false);
        return $chunk->process($properties);
    }

    private function _getTplChunk($name,$postfix = '.chunk.tpl') {
        $chunk = false;
        $f = $this->config['chunksPath'].strtolower($name).$postfix;
        if (file_exists($f)) {
            $o = file_get_contents($f);
            $chunk = $this->modx->newObject('modChunk');
            $chunk->set('name',$name);
            $chunk->setContent($o);
        }
        return $chunk;
    }
}